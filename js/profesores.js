const usuario =
JSON.parse(
    localStorage.getItem(
        "usuarioActivo"
    )
);

// VALIDAR

if(!usuario){

    window.location.href =
    "../index.html";
}

// ELEMENTOS

const bienvenida =
document.getElementById(
    "bienvenida"
);

const avatarImg =
document.getElementById(
    "avatarImg"
);

const tablaTutorias =
document.getElementById(
    "tablaTutorias"
);

// CARDS

const pendientesCount =
document.getElementById(
    "pendientesCount"
);

const aprobadasCount =
document.getElementById(
    "aprobadasCount"
);

const finalizadasCount =
document.getElementById(
    "finalizadasCount"
);


const menuToggle =
document.getElementById("menuToggle");

const sidebar =
document.querySelector(".sidebar");

menuToggle.addEventListener("click", ()=>{

    sidebar.classList.toggle("active");

});

// MOSTRAR DATOS

bienvenida.textContent =
`Bienvenido, ${usuario.nombre}`;

avatarImg.src =
"../assets/images/patricia.jpg";

// LOGOUT

document.getElementById("logout")
.addEventListener("click", ()=>{

    localStorage.removeItem(
        "usuarioActivo"
    );

    window.location.href =
    "../index.html";

});

// TUTORIAS

let tutorias = [];

// CARGAR

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

// RENDER

function renderTutorias(){

    tablaTutorias.innerHTML = "";

    // SOLO DEL PROFESOR

    const tutoriasProfesor =
    tutorias.filter(t =>

        t.profesorId === usuario.id
    );

    tutoriasProfesor.forEach(tutoria => {

        const tr =
        document.createElement("tr");

        tr.innerHTML = `

            <td>
                ${tutoria.estudiante}
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
                ${tutoria.estado}
            </td>

            <td>

                <button
                    class="aprobar"
                    onclick="aprobarTutoria(${tutoria.id})"
                >
                    Aprobar
                </button>

                <button
                    class="rechazar"
                    onclick="rechazarTutoria(${tutoria.id})"
                >
                    Rechazar
                </button>

            </td>
        `;

        tablaTutorias.appendChild(tr);

    });

}

// APROBAR

function aprobarTutoria(id){

    const tutoria =
    tutorias.find(t =>

        t.id === id
    );

    tutoria.estado =
    "Aprobada";

    guardarCambios();

}

// RECHAZAR

function rechazarTutoria(id){

    const tutoria =
    tutorias.find(t =>

        t.id === id
    );

    tutoria.estado =
    "Rechazada";

    guardarCambios();

}

// GUARDAR

function guardarCambios(){

    localStorage.setItem(
        "tutorias",
        JSON.stringify(tutorias)
    );

    renderTutorias();

    actualizarCards();

}

// CARDS

function actualizarCards(){

    const tutoriasProfesor =
    tutorias.filter(t =>

        t.profesorId === usuario.id
    );

    // PENDIENTES

    const pendientes =
    tutoriasProfesor.filter(t =>

        t.estado === "Pendiente"
    ).length;

    // APROBADAS

    const aprobadas =
    tutoriasProfesor.filter(t =>

        t.estado === "Aprobada"
    ).length;

    // FINALIZADAS

    const finalizadas =
    tutoriasProfesor.filter(t =>

        t.estado === "Finalizada"
    ).length;

    pendientesCount.textContent =
    pendientes;

    aprobadasCount.textContent =
    aprobadas;

    finalizadasCount.textContent =
    finalizadas;

}




// INICIAR

cargarTutorias();

renderTutorias();

actualizarCards();