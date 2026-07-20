from pydantic import BaseModel
from typing import Optional


class Estudiante(BaseModel):

    id: Optional[int] = None

    usuario_id: int

    cedula: str

    carrera_id: int

    semestre: Optional[str] = None