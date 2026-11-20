# backend/src/models/__init__.py

from src.models.catalogo_model import (
    CatalogoAsic,
    CatalogoCargo,
    CatalogoEstatus,
    CatalogoEstatusContrato,
    CatalogoHorarios,
    CatalogoNivelGrado,
    CatalogoRed,
    CatalogoUbicacionAdministrativa,
    CatalogoUbicacionFisica,
)
from src.models.trabajador_model import (
    DatosLaborales,
    Hijo,
    SaludDotacion,
    Trabajador,
    UbicacionLaboral,
    Vacacion,
)
from src.models.usuarios_model import (
    RolesDeUsuarios,
    UsuariosDelSistema,
)
from src.models.vista_model import VistaConsolidadoTrabajador

__all__ = [
    "CatalogoAsic",
    "CatalogoCargo",
    "CatalogoEstatus",
    "CatalogoEstatusContrato",
    "CatalogoHorarios",
    "CatalogoNivelGrado",
    "CatalogoRed",
    "CatalogoUbicacionAdministrativa",
    "CatalogoUbicacionFisica",
    "DatosLaborales",
    "Hijo",
    "SaludDotacion",
    "Trabajador",
    "UbicacionLaboral",
    "Vacacion",
    "RolesDeUsuarios",
    "UsuariosDelSistema",
    "VistaConsolidadoTrabajador",
]
