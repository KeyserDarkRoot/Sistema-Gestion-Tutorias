from fastapi import APIRouter, HTTPException

from schemas.auth_schema import LoginRequest

from services.auth_service import login_usuario



router = APIRouter(
    prefix="/auth",
    tags=["Autenticación"]
)



@router.post("/login")
def login(datos: LoginRequest):


    usuario = login_usuario(
        datos.correo,
        datos.password
    )


    if usuario is None:

        raise HTTPException(
            status_code=401,
            detail="Correo o contraseña incorrectos"
        )


    return {

        "mensaje":"Login correcto",

        "usuario":usuario

    }