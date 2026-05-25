const usuario =
JSON.parse(localStorage.getItem("usuarioActivo"));

const horaSelect =
document.getElementById("hora");

const fechaSelect =
document.getElementById("fecha");

let horariosData = [];

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
usuario.foto;

// LOGOUT

document.getElementById("logout")
.addEventListener("click", ()=>{

    localStorage.removeItem(
        "usuarioActivo"
    );

    window.location.href =
    "../index.html";

});

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
let tutorias = [];

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

    // HORARIOS

    const horariosResponse =
    await fetch("../data/horarios.json");

    const horariosJson =
    await horariosResponse.json();

    horariosData =
    horariosJson.horarios;

    // MATERIAS

    const materiasResponse =
    await fetch("../data/materias.json");

    const materiasJson =
    await materiasResponse.json();

    materiasData =
    materiasJson.materias;

    // PROFESORES

    const profesoresResponse =
    await fetch("../data/profesores.json");

    const profesoresJson =
    await profesoresResponse.json();

    profesoresData =
    profesoresJson.profesores;

    // LIMPIAR

    materiaSelect.innerHTML = `

        <option value="">
            Seleccionar materia
        </option>

    `;

    // RECORRER MATERIAS

    usuario.materias.forEach(idMateria => {

        const materia =
        materiasData.find(m =>

            m.id === idMateria
        );

        if(materia){

            const option =
            document.createElement("option");

            option.value =
            materia.id;

            option.textContent =
            materia.nombre;

            materiaSelect.appendChild(option);

        }

    });

}

// EJECUTAR

cargarDatosModal();

// =========================
// FILTRAR PROFESORES
// =========================

materiaSelect.addEventListener("change", ()=>{

    const materiaId =
    parseInt(materiaSelect.value);

    // LIMPIAR

    profesorSelect.innerHTML = `

        <option value="">
            Seleccionar profesor
        </option>

    `;

    // FILTRAR

    const profesoresFiltrados =
    profesoresData.filter(profesor =>

        profesor.materias.includes(
            materiaId
        )
    );

    // RECORRER

    profesoresFiltrados.forEach(profesor => {

        const option =
        document.createElement("option");

        option.value =
        profesor.id;

        option.textContent =
        profesor.nombre;

        profesorSelect.appendChild(option);

    });

});

// =========================
// HORARIOS Y FECHAS
// =========================

profesorSelect.addEventListener("change", ()=>{

    const profesorId =
    parseInt(profesorSelect.value);

    // BUSCAR HORARIO

    const horarioProfesor =
    horariosData.find(h =>

        h.profesorId === profesorId
    );

    // LIMPIAR HORAS

    horaSelect.innerHTML = `

        <option value="">
            Seleccionar hora
        </option>

    `;

    // LIMPIAR FECHAS

    fechaSelect.innerHTML = `

        <option value="">
            Seleccionar fecha
        </option>

    `;

    // VALIDAR

    if(!horarioProfesor) return;

    // =========================
    // HORAS
    // =========================

    horarioProfesor.horas.forEach(hora => {

        const option =
        document.createElement("option");

        option.value = hora;

        option.textContent = hora;

        horaSelect.appendChild(option);

    });

    // =========================
    // FECHAS
    // =========================

    const diasSemana = {

        "Domingo":0,
        "Lunes":1,
        "Martes":2,
        "Miércoles":3,
        "Jueves":4,
        "Viernes":5,
        "Sábado":6
    };

    const meses = [

        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre"
    ];

    const hoy = new Date();

    // GENERAR 30 DÍAS

    for(let i = 0; i < 30; i++){

        const fecha =
        new Date();

        fecha.setDate(
            hoy.getDate() + i
        );

        const diaNumero =
        fecha.getDay();

        const nombreDia =
        Object.keys(diasSemana)
        .find(key =>

            diasSemana[key] === diaNumero
        );

        // VALIDAR DÍA

        if(
            horarioProfesor.dias.includes(
                nombreDia
            )
        ){

            const dia =
            fecha.getDate();

            const mes =
            meses[fecha.getMonth()];

            const anio =
            fecha.getFullYear();

            // TEXTO

            const textoFecha =
`${nombreDia} ${dia} de ${mes}`;

            // VALUE

            const fechaValue =
`${anio}-${String(
fecha.getMonth()+1
).padStart(2,"0")}-${String(
dia
).padStart(2,"0")}`;

            // OPTION

            const option =
            document.createElement("option");

            option.value =
            fechaValue;

            option.textContent =
            textoFecha;

            fechaSelect.appendChild(option);

        }

    }

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
// INICIAR
// =========================

cargarTutorias();

renderTutorias();