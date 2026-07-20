const form = document.getElementById("loginForm");


form.addEventListener("submit", async(e)=>{

    e.preventDefault();


    const correo =
    document.getElementById("correo")
    .value.trim();


    const password =
    document.getElementById("password")
    .value.trim();



    // =========================
    // BUSCAR USUARIO
    // =========================


    const {data:usuario,error}=

    await supabaseClient

    .from("usuarios")

    .select("*")

    .eq("correo",correo)

    .eq("password",password)

    .eq("estado",true)

    .single();



    if(error || !usuario){

        document.getElementById("mensajeError").innerHTML =
        "Correo o contraseña incorrectos";

        return;

    }



    // BUSCAR ROL

    const {data:rol,error:rolError}=

    await supabaseClient

    .from("roles")

    .select("*")

    .eq("id",usuario.rol_id);



    console.log("ROL:", rol);
    console.log("ERROR ROL:", rolError);



    if(rolError || !rol){

        alert("Rol no encontrado");

        return;

    }



    usuario.roles = rol;

    console.log(usuario);



    if(error || !usuario){

        document.getElementById("mensajeError").innerHTML =
        "Correo o contraseña incorrectos";

        return;

    }



    // =========================
    // REGEX
    // =========================


    const estudianteRegex =
    /^e\d{10}@live\.uleam\.edu\.ec$/;


    const docenteRegex =
    /^p[a-zA-Z]+@live\.uleam\.edu\.ec$/;



    // =========================
    // ESTUDIANTE
    // =========================


    if(

        usuario.roles[0].nombre.toLowerCase() === "estudiante"

        &&

        estudianteRegex.test(correo)

    ){


        const {data:estudiante,error}=

        await supabaseClient

        .from("estudiantes")

        .select("*")

        .eq("usuario_id",usuario.id);


        console.log("ESTUDIANTE:", estudiante);
        console.log("ERROR:", error);



        if(error || !estudiante){

            alert("No existen datos del estudiante");

            return;

        }



        const usuarioCompleto = {

            ...usuario,

            ...estudiante

        };



        localStorage.setItem(

            "usuarioActivo",

            JSON.stringify(usuarioCompleto)

        );



        window.location.href =
        "pages/estudiantes.html";


        return;

    }



    // =========================
    // PROFESOR
    // =========================


    if(

        usuario.roles[0].nombre.toLowerCase() === "profesor"

        &&

        docenteRegex.test(correo)

    ){


        const {data:profesor,error}=

        await supabaseClient

        .from("profesores")

        .select("*")

        .eq("usuario_id",usuario.id)

        .single();



        if(error || !profesor){

            alert("No existen datos del profesor");

            return;

        }



        const usuarioCompleto={

            ...usuario,

            ...profesor

        };



        localStorage.setItem(

            "usuarioActivo",

            JSON.stringify(usuarioCompleto)

        );



        window.location.href =
        "pages/profesor.html";


        return;

    }



    // =========================
    // ADMIN
    // =========================


    if(usuario.roles[0].nombre.toLowerCase().includes("admin")){


        localStorage.setItem(

            "usuarioActivo",

            JSON.stringify(usuario)

        );


        window.location.href =
        "pages/admin.html";


        return;

    }



    document.getElementById("mensajeError").innerHTML =
    "Formato de correo inválido";


});