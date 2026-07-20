from pydantic import BaseModel
from typing import Optional


class Materia(BaseModel):

    id: Optional[int] = None

    nombre: str

    codigo: str