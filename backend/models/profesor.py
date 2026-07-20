from pydantic import BaseModel
from typing import Optional


class Profesor(BaseModel):

    id: Optional[int] = None

    usuario_id: int

    titulo: str

    especialidad: str