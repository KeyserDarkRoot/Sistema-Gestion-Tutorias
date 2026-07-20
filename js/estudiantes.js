const usuario =
JSON.parse(localStorage.getItem("usuarioActivo"));

const horaSelect =
document.getElementById("hora");

const fechaSelect =
document.getElementById("fecha");

const pendientesCount =
document.getElementById("pendientesCount");

const aprobadasCount =
document.getElementById("aprobadasCount");

const finalizadasCount =
document.getElementById("finalizadasCount");


// VALIDAR SESIÓN

if(!usuario){

    window.location.href =
    "../index.html";
}

// ELEMENTOS

const bienvenida =
document.getElementById("bienvenida");

const nombreUsuario =
document.getElementById("nombreUsuario");

const avatarImg =
document.getElementById("avatarImg");

// MOSTRAR DATOS

bienvenida.textContent =
`Bienvenido, ${usuario.nombre}`;

nombreUsuario.textContent =
usuario.nombre;

// FOTO DINÁMICA

avatarImg.src =
"../assets/images/keyser.jpeg";

// LOGOUT

document.getElementById("logout")
.addEventListener("click", ()=>{

    localStorage.removeItem(
        "usuarioActivo"
    );

    window.location.href =
    "../index.html";

});

async function cargarPerfilEstudiante(){


    console.log(
        "Usuario sesión:",
        usuario
    );


    const usuarioId =
    usuario.id;



    const {data,error}=await supabaseClient
    .from("estudiantes")
    .select("*")
    .eq(
        "usuario_id",
        usuarioId
    );



    console.log(
        "Respuesta estudiantes:",
        data,
        error
    );



    if(error){

        console.error(
            error
        );

        return;

    }



    if(!data || data.length===0){

        console.error(
            "No existe estudiante con usuario_id:",
            usuarioId
        );

        return;

    }



    perfilEstudiante =
    data[0];


    console.log(
        "Perfil estudiante cargado:",
        perfilEstudiante
    );


}

// MENU RESPONSIVE

const menuToggle =
document.getElementById("menuToggle");

const sidebar =
document.querySelector(".sidebar");

if(menuToggle){

    menuToggle.addEventListener("click", ()=>{

        sidebar.classList.toggle("active");

    });

}

// =========================
// MODAL
// =========================

const modal =
document.getElementById("modalTutoria");

const abrirModal =
document.getElementById("abrirModal");



const cerrarModal =
document.getElementById("cerrarModal");

// ABRIR

abrirModal.addEventListener("click", ()=>{

    modal.classList.add("active");

});

// CERRAR

cerrarModal.addEventListener("click", ()=>{

    modal.classList.remove("active");

});

// CERRAR AFUERA

window.addEventListener("click",(e)=>{

    if(e.target === modal){

        modal.classList.remove("active");

    }

});


// =========================
// SELECTS
// =========================

const materiaSelect =
document.getElementById("materia");

const profesorSelect =
document.getElementById("profesor");

// VARIABLES

let materiasData = [];
let profesoresData = [];
let horariosData = [];

let tutorias = [];

let perfilEstudiante = null;

// =========================
// CARGAR TUTORIAS
// =========================

function cargarTutorias(){

    const tutoriasGuardadas =

    localStorage.getItem(
        "tutorias"
    );

    if(tutoriasGuardadas){

        tutorias =
        JSON.parse(
            tutoriasGuardadas
        );

    }else{

        tutorias = [];

    }

}

// =========================
// CARGAR DATOS MODAL
// =========================

async function cargarDatosModal(){


    // CARGAR MATERIAS

    const {data:materias,error:materiaError}=

    await supabaseClient
    .from("materias")
    .select("*")
    .eq("estado",true);



    if(materiaError){

        console.error(
            materiaError
        );

        return;

    }



    materiasData=materias;



    materiaSelect.innerHTML=`

        <option value="">
            Seleccionar materia
        </option>

    `;



    materiasData.forEach(materia=>{


        const option =
        document.createElement("option");


        option.value =
        materia.id;


        option.textContent =
        materia.nombre;


        materiaSelect.appendChild(option);


    });


    // =========================
    // CARGAR PROFESORES
    // =========================

    const { data: profesores, error: profesorError } =
    await supabaseClient
    .from("profesores")
    .select(`
        id,
        usuario_id,
        usuarios (
            nombre
        )
    `);

    if(profesorError){

        console.error(profesorError);

        return;

    }

    profesoresData = profesores;

    profesorSelect.innerHTML = `
        <option value="">
            Seleccionar profesor
        </option>
    `;


}

// EJECUTAR

cargarDatosModal();

// =========================
// FILTRAR PROFESORES
// =========================



materiaSelect.addEventListener(
"change",
async()=>{


    const materiaId =
    parseInt(
        materiaSelect.value
    );


    if(!materiaId)
        return;



    const {data,error}=

    await supabaseClient
    .from("profesor_materia")
    .select(`
        profesor_id,
        profesores(
            id,
            usuarios(
                nombre
            )
        )
    `)
    .eq(
        "materia_id",
        materiaId
    );



    if(error){

        console.error(error);

        return;

    }



    profesorSelect.innerHTML=`

        <option value="">
            Seleccionar profesor
        </option>

    `;



    profesoresData=data;



    data.forEach(item=>{


        const option =
        document.createElement("option");


        option.value =
        item.profesores.id;


        option.textContent =
        item.profesores.usuarios.nombre;



        profesorSelect.appendChild(option);


    });


});

// =========================
// HORARIOS Y FECHAS
// =========================

profesorSelect.addEventListener(
"change",
async()=>{


    const profesorId =
    parseInt(
        profesorSelect.value
    );


    if(!profesorId)
        return;



    const {data,error}=

    await supabaseClient
    .from("horarios_profesor")
    .select("*")
    .eq(
        "profesor_id",
        profesorId
    )
    .eq(
        "estado",
        true
    );



    if(error){

        console.error(error);

        return;

    }



    horariosData=data;

    // =========================
    // GENERAR FECHAS DISPONIBLES
    // =========================


    fechaSelect.innerHTML = `

    <option value="">
    Seleccionar fecha
    </option>

    `;



    const diasSemana = {

        "Domingo":0,
        "Lunes":1,
        "Martes":2,
        "Miércoles":3,
        "Jueves":4,
        "Viernes":5,
        "Sábado":6

    };



    const hoy = new Date();



    for(let i = 0; i < 30; i++){


        const fecha =
        new Date();


        fecha.setDate(
            hoy.getDate()+i
        );


        const diaNumero =
        fecha.getDay();



        const nombreDia =
        Object.keys(diasSemana)
        .find(dia =>
            diasSemana[dia] === diaNumero
        );



        const existeHorario =
        horariosData.some(horario =>
            horario.dia === nombreDia
        );



        if(existeHorario){


            const option =
            document.createElement("option");


            const fechaTexto =
            `${nombreDia} ${fecha.getDate()}/${fecha.getMonth()+1}/${fecha.getFullYear()}`;


            option.value =
            fecha.toISOString()
            .split("T")[0];


            option.textContent =
            fechaTexto;



            fechaSelect.appendChild(option);

    
        }



    }

    console.log("HORARIOS:", horariosData);





    horariosData.forEach(horario=>{


        const option =
        document.createElement("option");


        option.value =
        horario.hora_inicio;


        option.textContent =
        horario.hora_inicio+
        " - "+
        horario.hora_fin;


        horaSelect.appendChild(option);
        



    });



});



// =========================
// FORM TUTORIA
// =========================

const formTutoria =
document.getElementById("formTutoria");

const tablaTutorias =
document.getElementById("tablaTutorias");

// SUBMIT

formTutoria.addEventListener("submit",(e)=>{

    e.preventDefault();

    // VALORES

    const materiaId =
    parseInt(materiaSelect.value);

    const profesorId =
    parseInt(profesorSelect.value);

    const fecha =
    fechaSelect.value;

    const hora =
    horaSelect.value;

    const modalidad =
    document.getElementById("modalidad").value;

    const motivo =
    document.getElementById("motivo").value;

    // VALIDAR

    if(
        !materiaId ||
        !profesorId ||
        !fecha ||
        !hora ||
        !motivo
    ){

        alert(
            "Completa todos los campos"
        );

        return;

    }

    // BUSCAR MATERIA

    const materia =
    materiasData.find(m =>

        m.id === materiaId
    );

    // BUSCAR PROFESOR

    const profesor =
    profesoresData.find(p =>

        p.id === profesorId
    );


    if(!profesor){

        alert("Profesor no encontrado");

        return;

    }

    console.log("MATERIA:", materia);
    console.log("PROFESOR:", profesor);

    // CREAR TUTORIA

    const nuevaTutoria = {

        id: Date.now(),

        estudianteId:
        usuario.id,

        estudiante:
        usuario.nombre,

        profesorId:
        profesor.id,

        profesor:
        profesor.nombre,

        materia:
        materia.nombre,

        fecha,

        hora,

        modalidad,

        motivo,

        estado:"Pendiente"
    };

    // AGREGAR

    tutorias.push(
        nuevaTutoria
    );

    // GUARDAR LOCAL

    localStorage.setItem(

        "tutorias",

        JSON.stringify(
            tutorias
        )

    );

    // RENDER

    renderTutorias();

    // CERRAR MODAL

    modal.classList.remove(
        "active"
    );

    // LIMPIAR

    formTutoria.reset();

});

// =========================
// RENDER TUTORIAS
// =========================

function renderTutorias(){

    // LIMPIAR

    tablaTutorias.innerHTML = "";

    // FILTRAR SOLO DEL ESTUDIANTE

    const tutoriasEstudiante =
    tutorias.filter(t =>

        t.estudianteId === usuario.id
    );

    // VALIDAR

    if(
        tutoriasEstudiante.length === 0
    ){

        tablaTutorias.innerHTML = `

            <tr>

                <td colspan="5">

                    No hay tutorías registradas

                </td>

            </tr>

        `;

        return;

    }

    // RECORRER

    tutoriasEstudiante.forEach(tutoria => {

        const tr =
        document.createElement("tr");

        tr.innerHTML = `

            <td>
                ${tutoria.profesor}
            </td>

            <td>
                ${tutoria.materia}
            </td>

            <td>
                ${tutoria.fecha}
            </td>

            <td>
                ${tutoria.hora}
            </td>

            <td>

                <span class="status ${tutoria.estado.toLowerCase()}">

                    ${tutoria.estado}

                </span>

            </td>

        `;

        tablaTutorias.appendChild(tr);

    });

}


// =========================
// ACTUALIZAR CARDS
// =========================

function actualizarCards(){

    // FILTRAR DEL ESTUDIANTE

    const tutoriasEstudiante =
    tutorias.filter(t =>

        t.estudianteId === usuario.id
    );

    // PENDIENTES

    const pendientes =
    tutoriasEstudiante.filter(t =>

        t.estado === "Pendiente"
    ).length;

    // APROBADAS

    const aprobadas =
    tutoriasEstudiante.filter(t =>

        t.estado === "Aprobada"
    ).length;

    // FINALIZADAS

    const finalizadas =
    tutoriasEstudiante.filter(t =>

        t.estado === "Finalizada"
    ).length;

    // MOSTRAR

    pendientesCount.textContent =
    pendientes;

    aprobadasCount.textContent =
    aprobadas;

    finalizadasCount.textContent =
    finalizadas;

}
// =========================
// INICIAR
// =========================

async function iniciar(){

    await cargarPerfilEstudiante();

    await cargarDatosModal();

    cargarTutorias();

    renderTutorias();

    actualizarCards();

}


iniciar();