from fastapi import FastAPI

from routers import auth



app = FastAPI(
    title="Sistema Gestión Tutorías"
)



app.include_router(
    auth.router
)



@app.get("/")
def inicio():

    return {
        "mensaje":
        "API funcionando"
    }