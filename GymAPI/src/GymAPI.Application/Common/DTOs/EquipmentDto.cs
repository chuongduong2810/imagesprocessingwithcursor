using GymAPI.Domain.ValueObjects;

namespace GymAPI.Application.Common.DTOs;

public record EquipmentDto(
    Guid Id,
    string Name,
    string Description,
    EquipmentCategory Category,
    string Manufacturer,
    string SerialNumber,
    DateTime PurchaseDate,
    decimal PurchasePrice,
    EquipmentStatus Status,
    DateTime? LastMaintenanceDate,
    DateTime? NextMaintenanceDate,
    string Location,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);

public record CreateEquipmentDto(
    string Name,
    string Description,
    EquipmentCategory Category,
    string Manufacturer,
    string SerialNumber,
    DateTime PurchaseDate,
    decimal PurchasePrice,
    string Location
);

public record UpdateEquipmentDto(
    string Name,
    string Description,
    EquipmentStatus Status,
    DateTime? LastMaintenanceDate,
    DateTime? NextMaintenanceDate,
    string Location
);