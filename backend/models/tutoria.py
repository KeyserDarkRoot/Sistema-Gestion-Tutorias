from pydantic import BaseModel
from typing import Optional


class SolicitudTutoria(BaseModel):

    id: Optional[int] = None

    estudiante_id: int

    profesor_id: int

    materia_id: int

    fecha: str

    hora: str

    modalidad: str

    motivo: str

    estado: Optional[str] = "Pendiente"