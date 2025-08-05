using GymAPI.Application.Common.DTOs;
using GymAPI.Application.Features.Assignments.Commands.CreateAssignment;
using GymAPI.Application.Features.Assignments.Queries.GetAssignmentById;
using GymAPI.Application.Features.Assignments.Queries.GetAssignments;
using Microsoft.AspNetCore.Mvc;

namespace GymAPI.API.Controllers;

[Route("api/[controller]")]
public class AssignmentsController : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> GetAssignments(
        [FromQuery] Guid? trainerId = null,
        [FromQuery] Guid? memberId = null,
        [FromQuery] bool? isPublic = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var query = new GetAssignmentsQuery(trainerId, memberId, isPublic, page, pageSize);
        var result = await Mediator.Send(query);
        
        return result.IsSuccess ? Ok(result.Value) : BadRequest(result.Error);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetAssignmentById(Guid id)
    {
        var query = new GetAssignmentByIdQuery(id);
        var result = await Mediator.Send(query);
        
        return result.IsSuccess ? Ok(result.Value) : NotFound(result.Error);
    }

    [HttpPost]
    public async Task<IActionResult> CreateAssignment([FromBody] CreateAssignmentDto createAssignmentDto)
    {
        var command = new CreateAssignmentCommand(createAssignmentDto);
        var result = await Mediator.Send(command);
        
        if (result.IsSuccess)
        {
            return CreatedAtAction(nameof(GetAssignmentById), new { id = result.Value.Id }, result.Value);
        }
        
        return BadRequest(result.Error);
    }

    //[HttpPost("{assignmentId}/media")]
    //public async Task<IActionResult> UploadAssignmentMedia(Guid assignmentId, [FromForm] IFormFile file, [FromForm] string? description = null)
    //{
    //    try
    //    {
    //        if (file == null || file.Length == 0)
    //        {
    //            return BadRequest("No file provided");
    //        }

    //        // Check file size (limit to 50MB)
    //        if (file.Length > 50 * 1024 * 1024)
    //        {
    //            return BadRequest("File size too large. Maximum size is 50MB.");
    //        }

    //        // Create uploads directory if it doesn't exist
    //        var uploadsPath = Path.Combine("wwwroot", "uploads", "assignments");
    //        Directory.CreateDirectory(uploadsPath);

    //        // Generate unique filename
    //        var fileExtension = Path.GetExtension(file.FileName);
    //        var fileName = $"{Guid.NewGuid()}{fileExtension}";
    //        var filePath = Path.Combine(uploadsPath, fileName);

    //        // Save file
    //        using (var stream = new FileStream(filePath, FileMode.Create))
    //        {
    //            await file.CopyToAsync(stream);
    //        }

    //        // Determine media type
    //        var mediaType = GetMediaTypeFromContentType(file.ContentType);

    //        // Create thumbnail for images
    //        string? thumbnailPath = null;
    //        if (mediaType == Domain.ValueObjects.MediaType.Image)
    //        {
    //            // TODO: Implement thumbnail generation
    //        }

    //        var createMediaDto = new CreateAssignmentMediaDto(
    //            assignmentId,
    //            fileName,
    //            file.FileName,
    //            file.ContentType,
    //            $"/uploads/assignments/{fileName}",
    //            file.Length,
    //            mediaType,
    //            thumbnailPath,
    //            description,
    //            0
    //        );

    //        // TODO: Create command handler for adding media
    //        // var command = new CreateAssignmentMediaCommand(createMediaDto);
    //        // var result = await Mediator.Send(command);

    //        return Ok(new { message = "File uploaded successfully", fileName, filePath = $"/uploads/assignments/{fileName}" });
    //    }
    //    catch (Exception ex)
    //    {
    //        return StatusCode(500, $"Internal server error: {ex.Message}");
    //    }
    //}

    private static Domain.ValueObjects.MediaType GetMediaTypeFromContentType(string contentType)
    {
        return contentType.ToLower() switch
        {
            var type when type.StartsWith("image/gif") => Domain.ValueObjects.MediaType.Gif,
            var type when type.StartsWith("image/") => Domain.ValueObjects.MediaType.Image,
            var type when type.StartsWith("video/") => Domain.ValueObjects.MediaType.Video,
            var type when type.StartsWith("audio/") => Domain.ValueObjects.MediaType.Audio,
            _ => Domain.ValueObjects.MediaType.Document
        };
    }
}