const form =
document.getElementById("loginForm");

form.addEventListener("submit", async(e)=>{

    e.preventDefault();

    const correo =
    document.getElementById("correo")
    .value.trim();

    const password =
    document.getElementById("password")
    .value.trim();

    // CARGAR JSONS

    const usuariosResponse =
    await fetch("../data/usuarios.json");

    const estudiantesResponse =
    await fetch("../data/estudiantes.json");

    const profesoresResponse =
    await fetch("../data/profesores.json");

    const usuariosData =
    await usuariosResponse.json();

    const estudiantesData =
    await estudiantesResponse.json();

    const profesoresData =
    await profesoresResponse.json();

    // BUSCAR USUARIO

    const usuario =
    usuariosData.usuarios.find(u =>

        u.correo === correo &&
        u.password === password
    );

    // VALIDAR

    if(!usuario){

        alert("Correo o contraseña incorrectos");
        return;
    }

    // REGEX

    const estudianteRegex =
    /^e\d{10}@live\.uleam\.edu\.ec$/;

    const docenteRegex =
    /^p[a-zA-Z]+@live\.uleam\.edu\.ec$/;

    // =========================
    // ESTUDIANTE
    // =========================

    if(
        usuario.rol === "estudiante" &&
        estudianteRegex.test(correo)
    ){

        // BUSCAR DATOS COMPLETOS

        const estudiante =
        estudiantesData.estudiantes.find(e =>

            e.usuarioId === usuario.id
        );

        // FUSIONAR

        const usuarioCompleto = {

            ...usuario,
            ...estudiante
        };

        // GUARDAR SESIÓN

        localStorage.setItem(
            "usuarioActivo",
            JSON.stringify(usuarioCompleto)
        );

        // REDIRECT

        window.location.href =
        "../pages/estudiantes.html";

        return;
    }

    // =========================
    // PROFESOR
    // =========================

    if(
        usuario.rol === "profesor" &&
        docenteRegex.test(correo)
    ){

        // BUSCAR DATOS

        const profesor =
        profesoresData.profesores.find(p =>

            p.usuarioId === usuario.id
        );

        // FUSIONAR

        const usuarioCompleto = {

            ...usuario,
            ...profesor
        };

        // GUARDAR

        localStorage.setItem(
            "usuarioActivo",
            JSON.stringify(usuarioCompleto)
        );

        // REDIRECT

        window.location.href =
        "../pages/profesor.html";

        return;
    }

    alert("Formato de correo inválido");

});