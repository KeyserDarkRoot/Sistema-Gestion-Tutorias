from ConexionBD.supabase import supabase


respuesta = supabase.table(
    "usuarios"
).select("*").execute()


print("Datos:")
print(respuesta.data)


print("Respuesta completa:")
print(respuesta)