from pydantic import BaseModel


class CrearTutoria(BaseModel):

    materia_id:int

    profesor_id:int

    fecha:str

    hora:str

    modalidad:str

    motivo:str