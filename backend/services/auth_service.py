from ConexionBD.supabase import supabase



def login_usuario(correo, password):


    respuesta = (
        supabase
        .table("usuarios")
        .select("*")
        .eq("correo", correo)
        .eq("password", password)
        .execute()
    )


    if len(respuesta.data) == 0:

        return None


    return respuesta.data[0]