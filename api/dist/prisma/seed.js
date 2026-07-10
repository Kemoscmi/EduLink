import { EstadoCita, Modalidad, Role } from "../generated/prisma/enums";
import { prisma } from "../src/config/prisma";
async function main() {
    console.log("Iniciando seed...");
    // 1. Limpieza de datos 
    const models = [
        prisma.resena,
        prisma.cita,
        prisma.servicioEspecialidad,
        prisma.tutorEspecialidad,
        prisma.servicio,
        prisma.perfilTutor,
        prisma.especialidad,
        prisma.categoria,
        prisma.usuario
    ];
    for (const model of models) {
        await model.deleteMany();
    }
    // 2. Creación de datos maestros (Independientes) 
    //Categorías (5) activas e inactivas
    await prisma.categoria.createMany({
        data: [
            {
                nombre: "Matemáticas",
                descripcion: "Tutorías relacionadas con matemáticas",
                activo: true
            },
            {
                nombre: "Idiomas",
                descripcion: "Tutorías de idiomas extranjeros",
                activo: true
            },
            {
                nombre: "Programación",
                descripcion: "Tutorías de desarrollo de software",
                activo: true
            },
            {
                nombre: "Ciencias",
                descripcion: "Tutorías de física, química y biología",
                activo: true
            },
            {
                nombre: "Arte y Música",
                descripcion: "Tutorías relacionadas con disciplinas artísticas y musicales.",
                activo: false
            }
        ]
    });
    //Especialidades (8) activas e inactivas
    await prisma.especialidad.createMany({
        data: [
            {
                nombre: "Álgebra",
                descripcion: "Resolución de ecuaciones, funciones y expresiones algebraicas.",
                activo: true
            },
            {
                nombre: "Cálculo",
                descripcion: "Derivadas, integrales y aplicaciones del cálculo diferencial e integral.",
                activo: true
            },
            {
                nombre: "Java",
                descripcion: "Programación orientada a objetos utilizando Java.",
                activo: true
            },
            {
                nombre: "JavaScript",
                descripcion: "Desarrollo web interactivo con JavaScript moderno.",
                activo: true
            },
            {
                nombre: "Inglés",
                descripcion: "Comprensión, conversación y gramática del idioma inglés.",
                activo: true
            },
            {
                nombre: "Física",
                descripcion: "Conceptos fundamentales de mecánica, energía y movimiento.",
                activo: true
            },
            {
                nombre: "Química",
                descripcion: "Estudio de compuestos, reacciones químicas y estequiometría.",
                activo: false
            },
            {
                nombre: "Piano",
                descripcion: "Interpretación musical y fundamentos de ejecución en piano.",
                activo: false
            }
        ]
    });
    //Usuarios (8)
    await prisma.usuario.createMany({
        data: [
            {
                nombre: "Administrador",
                apellidos: "Sistema",
                email: "admin@edulink.com",
                password: "hash_password",
                telefono: "88880000",
                activo: true,
                role: Role.ADMIN
            },
            {
                nombre: "Ana",
                apellidos: "Rodríguez",
                email: "ana@edulink.com",
                password: "hash_password",
                telefono: "88881111",
                activo: true,
                role: Role.TUTOR
            },
            {
                nombre: "Carlos",
                apellidos: "Mora",
                email: "carlos@edulink.com",
                password: "hash_password",
                telefono: "88882222",
                activo: true,
                role: Role.TUTOR
            },
            {
                nombre: "María",
                apellidos: "Fernández",
                email: "maria@edulink.com",
                password: "hash_password",
                telefono: "88883333",
                activo: true,
                role: Role.TUTOR
            },
            {
                nombre: "José",
                apellidos: "Castro",
                email: "jose@edulink.com",
                password: "hash_password",
                telefono: "88884444",
                activo: true,
                role: Role.TUTOR
            },
            {
                nombre: "Sofía",
                apellidos: "Ramírez",
                email: "sofia@edulink.com",
                password: "hash_password",
                telefono: "88885555",
                activo: true,
                role: Role.TUTOR
            },
            {
                nombre: "Laura",
                apellidos: "Jiménez",
                email: "laura@edulink.com",
                password: "hash_password",
                telefono: "88886666",
                activo: true,
                role: Role.USER
            },
            {
                nombre: "David",
                apellidos: "Vargas",
                email: "david@edulink.com",
                password: "hash_password",
                telefono: "88887777",
                activo: true,
                role: Role.USER
            }
        ]
    });
    // 3. Recuperar datos para mapeo (Uso de Maps para optimizar) 
    const [cats, especs, users] = await Promise.all([
        prisma.categoria.findMany(),
        prisma.especialidad.findMany(),
        prisma.usuario.findMany(),
    ]);
    const categoriaMap = Object.fromEntries(cats.map(c => [c.nombre, c.id]));
    const especialidadMap = Object.fromEntries(especs.map(e => [e.nombre, e.id]));
    const usuarioMap = Object.fromEntries(users.map(u => [u.email, u.id]));
    // 4. Creación de PerfilesTutor con Relaciones 
    const tutorAna = await prisma.perfilTutor.create({
        data: {
            usuarioId: usuarioMap["ana@edulink.com"],
            tituloProfesional: "Ingeniera en Sistemas",
            descripcion: "Especialista en programación y bases de datos.",
            aniosExperiencia: 5,
            modalidad: Modalidad.MIXTA,
            ubicacion: "San José",
            tarifaBase: 12000,
            disponible: true
        }
    });
    const tutorCarlos = await prisma.perfilTutor.create({
        data: {
            usuarioId: usuarioMap["carlos@edulink.com"],
            tituloProfesional: "Licenciado en Matemáticas",
            descripcion: "Docente universitario de matemáticas.",
            aniosExperiencia: 8,
            modalidad: Modalidad.MIXTA,
            ubicacion: "Heredia",
            tarifaBase: 15000,
            disponible: true
        }
    });
    const tutorMaria = await prisma.perfilTutor.create({
        data: {
            usuarioId: usuarioMap["maria@edulink.com"],
            tituloProfesional: "Profesora de Inglés",
            descripcion: "Especialista en inglés conversacional.",
            aniosExperiencia: 6,
            modalidad: Modalidad.VIRTUAL,
            ubicacion: "Alajuela",
            tarifaBase: 10000,
            disponible: true
        }
    });
    const tutorJose = await prisma.perfilTutor.create({
        data: {
            usuarioId: usuarioMap["jose@edulink.com"],
            tituloProfesional: "Licenciado en Física",
            descripcion: "Tutor de física y ciencias.",
            aniosExperiencia: 10,
            modalidad: Modalidad.PRESENCIAL,
            ubicacion: "Cartago",
            tarifaBase: 14000,
            disponible: false
        }
    });
    const tutorSofia = await prisma.perfilTutor.create({
        data: {
            usuarioId: usuarioMap["sofia@edulink.com"],
            tituloProfesional: "Profesora de Música",
            descripcion: "Instructora de piano y teoría musical.",
            aniosExperiencia: 7,
            modalidad: Modalidad.PRESENCIAL,
            ubicacion: "San José",
            tarifaBase: 11000,
            disponible: false
        }
    });
    //Creación de Servicios 
    const servicioJava = await prisma.servicio.create({
        data: {
            tutorId: tutorAna.id,
            categoriaId: categoriaMap["Programación"],
            nombre: "Tutoría de Java",
            descripcion: "Programación orientada a objetos utilizando Java.",
            precio: 12000,
            duracion: 120,
            modalidad: Modalidad.VIRTUAL,
            activo: true
        }
    });
    const servicioJavaScript = await prisma.servicio.create({
        data: {
            tutorId: tutorAna.id,
            categoriaId: categoriaMap["Programación"],
            nombre: "Tutoría de JavaScript",
            descripcion: "Desarrollo web interactivo con JavaScript moderno.",
            precio: 13000,
            duracion: 120,
            modalidad: Modalidad.VIRTUAL,
            activo: true
        }
    });
    const servicioBD = await prisma.servicio.create({
        data: {
            tutorId: tutorAna.id,
            categoriaId: categoriaMap["Programación"],
            nombre: "Bases de Datos",
            descripcion: "Modelado y consultas SQL.",
            precio: 14000,
            duracion: 120,
            modalidad: Modalidad.MIXTA,
            activo: true
        }
    });
    const servicioAlgebra = await prisma.servicio.create({
        data: {
            tutorId: tutorCarlos.id,
            categoriaId: categoriaMap["Matemáticas"],
            nombre: "Tutoría de Álgebra",
            descripcion: "Resolución de ecuaciones y funciones.",
            precio: 10000,
            duracion: 90,
            modalidad: Modalidad.PRESENCIAL,
            activo: true
        }
    });
    const servicioCalculo = await prisma.servicio.create({
        data: {
            tutorId: tutorCarlos.id,
            categoriaId: categoriaMap["Matemáticas"],
            nombre: "Tutoría de Cálculo",
            descripcion: "Derivadas e integrales.",
            precio: 12000,
            duracion: 120,
            modalidad: Modalidad.MIXTA,
            activo: true
        }
    });
    const servicioInglesConversacional = await prisma.servicio.create({
        data: {
            tutorId: tutorMaria.id,
            categoriaId: categoriaMap["Idiomas"],
            nombre: "Inglés Conversacional",
            descripcion: "Práctica de conversación y pronunciación.",
            precio: 10000,
            duracion: 60,
            modalidad: Modalidad.VIRTUAL,
            activo: true
        }
    });
    const servicioInglesEmpresarial = await prisma.servicio.create({
        data: {
            tutorId: tutorMaria.id,
            categoriaId: categoriaMap["Idiomas"],
            nombre: "Inglés Empresarial",
            descripcion: "Comunicación profesional en inglés.",
            precio: 12000,
            duracion: 90,
            modalidad: Modalidad.VIRTUAL,
            activo: true
        }
    });
    const servicioFisica = await prisma.servicio.create({
        data: {
            tutorId: tutorJose.id,
            categoriaId: categoriaMap["Ciencias"],
            nombre: "Física General",
            descripcion: "Mecánica, energía y movimiento.",
            precio: 13000,
            duracion: 120,
            modalidad: Modalidad.PRESENCIAL,
            activo: true
        }
    });
    const servicioQuimica = await prisma.servicio.create({
        data: {
            tutorId: tutorJose.id,
            categoriaId: categoriaMap["Ciencias"],
            nombre: "Química General",
            descripcion: "Reacciones químicas y estequiometría.",
            precio: 13000,
            duracion: 120,
            modalidad: Modalidad.PRESENCIAL,
            activo: false
        }
    });
    const servicioPiano = await prisma.servicio.create({
        data: {
            tutorId: tutorSofia.id,
            categoriaId: categoriaMap["Arte y Música"],
            nombre: "Piano Básico",
            descripcion: "Introducción a la interpretación musical en piano.",
            precio: 11000,
            duracion: 90,
            modalidad: Modalidad.PRESENCIAL,
            activo: false
        }
    });
    //Creación de TutorEspecialidad
    await prisma.tutorEspecialidad.createMany({
        data: [
            // Ana
            {
                tutorId: tutorAna.id,
                especialidadId: especialidadMap["Java"]
            },
            {
                tutorId: tutorAna.id,
                especialidadId: especialidadMap["JavaScript"]
            },
            // Carlos
            {
                tutorId: tutorCarlos.id,
                especialidadId: especialidadMap["Álgebra"]
            },
            {
                tutorId: tutorCarlos.id,
                especialidadId: especialidadMap["Cálculo"]
            },
            // María
            {
                tutorId: tutorMaria.id,
                especialidadId: especialidadMap["Inglés"]
            },
            // José
            {
                tutorId: tutorJose.id,
                especialidadId: especialidadMap["Física"]
            },
            {
                tutorId: tutorJose.id,
                especialidadId: especialidadMap["Química"]
            },
            // Sofía
            {
                tutorId: tutorSofia.id,
                especialidadId: especialidadMap["Piano"]
            }
        ]
    });
    //Creación de ServicioEspecialidad
    await prisma.servicioEspecialidad.createMany({
        data: [
            {
                servicioId: servicioJava.id,
                especialidadId: especialidadMap["Java"]
            },
            {
                servicioId: servicioJavaScript.id,
                especialidadId: especialidadMap["JavaScript"]
            },
            {
                servicioId: servicioBD.id,
                especialidadId: especialidadMap["Java"]
            },
            {
                servicioId: servicioAlgebra.id,
                especialidadId: especialidadMap["Álgebra"]
            },
            {
                servicioId: servicioCalculo.id,
                especialidadId: especialidadMap["Cálculo"]
            },
            {
                servicioId: servicioInglesConversacional.id,
                especialidadId: especialidadMap["Inglés"]
            },
            {
                servicioId: servicioInglesEmpresarial.id,
                especialidadId: especialidadMap["Inglés"]
            },
            {
                servicioId: servicioFisica.id,
                especialidadId: especialidadMap["Física"]
            },
            {
                servicioId: servicioQuimica.id,
                especialidadId: especialidadMap["Química"]
            },
            {
                servicioId: servicioPiano.id,
                especialidadId: especialidadMap["Piano"]
            }
        ]
    });
    // 6. Creación de Citas
    const cita1 = await prisma.cita.create({
        data: {
            clienteId: usuarioMap["laura@edulink.com"],
            tutorId: tutorAna.id,
            servicioId: servicioJava.id,
            fechaCita: new Date("2026-06-20"),
            horaInicio: "08:00",
            horaFin: "10:00",
            modalidad: Modalidad.VIRTUAL,
            estado: EstadoCita.PENDIENTE,
            comentarioCliente: "Necesito reforzar conceptos de programación orientada a objetos.",
            montoEstimado: 12000
        }
    });
    const cita2 = await prisma.cita.create({
        data: {
            clienteId: usuarioMap["david@edulink.com"],
            tutorId: tutorAna.id,
            servicioId: servicioJavaScript.id,
            fechaCita: new Date("2026-06-21"),
            horaInicio: "09:00",
            horaFin: "11:00",
            modalidad: Modalidad.VIRTUAL,
            estado: EstadoCita.PENDIENTE,
            comentarioCliente: "Repasar funciones y callbacks.",
            montoEstimado: 13000
        }
    });
    const cita3 = await prisma.cita.create({
        data: {
            clienteId: usuarioMap["laura@edulink.com"],
            tutorId: tutorAna.id,
            servicioId: servicioBD.id,
            fechaCita: new Date("2026-06-22"),
            horaInicio: "14:00",
            horaFin: "16:00",
            modalidad: Modalidad.MIXTA,
            estado: EstadoCita.PENDIENTE,
            comentarioCliente: "Necesito ayuda con consultas SQL.",
            montoEstimado: 14000
        }
    });
    const cita4 = await prisma.cita.create({
        data: {
            clienteId: usuarioMap["david@edulink.com"],
            tutorId: tutorCarlos.id,
            servicioId: servicioAlgebra.id,
            fechaCita: new Date("2026-06-23"),
            horaInicio: "08:00",
            horaFin: "09:30",
            modalidad: Modalidad.PRESENCIAL,
            estado: EstadoCita.PENDIENTE,
            comentarioCliente: "Preparación para examen de álgebra.",
            montoEstimado: 10000
        }
    });
    const cita5 = await prisma.cita.create({
        data: {
            clienteId: usuarioMap["laura@edulink.com"],
            tutorId: tutorCarlos.id,
            servicioId: servicioCalculo.id,
            fechaCita: new Date("2026-06-24"),
            horaInicio: "10:00",
            horaFin: "12:00",
            modalidad: Modalidad.MIXTA,
            estado: EstadoCita.PENDIENTE,
            comentarioCliente: "Repasar integrales definidas.",
            montoEstimado: 12000
        }
    });
    const cita6 = await prisma.cita.create({
        data: {
            clienteId: usuarioMap["david@edulink.com"],
            tutorId: tutorMaria.id,
            servicioId: servicioInglesConversacional.id,
            fechaCita: new Date("2026-06-25"),
            horaInicio: "13:00",
            horaFin: "14:00",
            modalidad: Modalidad.VIRTUAL,
            estado: EstadoCita.PENDIENTE,
            comentarioCliente: "Práctica de conversación.",
            montoEstimado: 10000
        }
    });
    const cita7 = await prisma.cita.create({
        data: {
            clienteId: usuarioMap["laura@edulink.com"],
            tutorId: tutorMaria.id,
            servicioId: servicioInglesEmpresarial.id,
            fechaCita: new Date("2026-06-26"),
            horaInicio: "15:00",
            horaFin: "16:30",
            modalidad: Modalidad.VIRTUAL,
            estado: EstadoCita.PENDIENTE,
            comentarioCliente: "Preparación para entrevista laboral.",
            montoEstimado: 12000
        }
    });
    const cita8 = await prisma.cita.create({
        data: {
            clienteId: usuarioMap["david@edulink.com"],
            tutorId: tutorJose.id,
            servicioId: servicioFisica.id,
            fechaCita: new Date("2026-06-27"),
            horaInicio: "09:00",
            horaFin: "11:00",
            modalidad: Modalidad.PRESENCIAL,
            estado: EstadoCita.PENDIENTE,
            comentarioCliente: "Resolver ejercicios de mecánica.",
            montoEstimado: 13000
        }
    });
    const cita9 = await prisma.cita.create({
        data: {
            clienteId: usuarioMap["laura@edulink.com"],
            tutorId: tutorJose.id,
            servicioId: servicioQuimica.id,
            fechaCita: new Date("2026-06-28"),
            horaInicio: "14:00",
            horaFin: "16:00",
            modalidad: Modalidad.PRESENCIAL,
            estado: EstadoCita.PENDIENTE,
            comentarioCliente: "Repasar balanceo de ecuaciones.",
            montoEstimado: 13000
        }
    });
    const cita10 = await prisma.cita.create({
        data: {
            clienteId: usuarioMap["david@edulink.com"],
            tutorId: tutorSofia.id,
            servicioId: servicioPiano.id,
            fechaCita: new Date("2026-06-29"),
            horaInicio: "10:00",
            horaFin: "11:30",
            modalidad: Modalidad.PRESENCIAL,
            estado: EstadoCita.PENDIENTE,
            comentarioCliente: "Introducción al piano.",
            montoEstimado: 11000
        }
    });
    const cita11 = await prisma.cita.create({
        data: {
            clienteId: usuarioMap["laura@edulink.com"],
            tutorId: tutorAna.id,
            servicioId: servicioJava.id,
            fechaCita: new Date("2026-06-30"),
            horaInicio: "17:00",
            horaFin: "19:00",
            modalidad: Modalidad.VIRTUAL,
            estado: EstadoCita.PENDIENTE,
            comentarioCliente: "Repasar colecciones y streams.",
            montoEstimado: 12000
        }
    });
    const cita12 = await prisma.cita.create({
        data: {
            clienteId: usuarioMap["david@edulink.com"],
            tutorId: tutorCarlos.id,
            servicioId: servicioAlgebra.id,
            fechaCita: new Date("2026-07-01"),
            horaInicio: "18:00",
            horaFin: "19:30",
            modalidad: Modalidad.PRESENCIAL,
            estado: EstadoCita.PENDIENTE,
            comentarioCliente: "Repaso general para examen final.",
            montoEstimado: 10000
        }
    });
    console.log("Seed completado con éxito.");
}
main()
    .catch((e) => {
    console.error("Error en seed:", e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
