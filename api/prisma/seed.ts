import bcrypt from "bcryptjs";
import { EstadoCita, Modalidad, Role } from "../generated/prisma/enums";
import { prisma } from "../src/config/prisma";

const PASSWORD_SEMILLA = "Edulink2026*";

async function main() {
    console.log("Iniciando seed...");
    const passwordHasheada = await bcrypt.hash(PASSWORD_SEMILLA, 10);
    // 1. Limpieza de datos
    const models = [
        prisma.resena,
        prisma.historialCita,
        prisma.cita,
        prisma.servicioEspecialidad,
        prisma.tutorEspecialidad,
        prisma.servicio,
        prisma.perfilTutor,
        prisma.especialidad,
        prisma.categoria,
        prisma.usuario
    ]
    for (const model of models) {
        await (model as any).deleteMany()
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
    })
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
                password: passwordHasheada,
                telefono: "88880000",
                activo: true,
                role: Role.ADMIN
            },
            {
                nombre: "Ana",
                apellidos: "Rodríguez",
                email: "ana@edulink.com",
                password: passwordHasheada,
                telefono: "88881111",
                activo: true,
                role: Role.TUTOR
            },
            {
                nombre: "Carlos",
                apellidos: "Mora",
                email: "carlos@edulink.com",
                password: passwordHasheada,
                telefono: "88882222",
                activo: true,
                role: Role.TUTOR
            },
            {
                nombre: "María",
                apellidos: "Fernández",
                email: "maria@edulink.com",
                password: passwordHasheada,
                telefono: "88883333",
                activo: true,
                role: Role.TUTOR
            },
            {
                nombre: "José",
                apellidos: "Castro",
                email: "jose@edulink.com",
                password: passwordHasheada,
                telefono: "88884444",
                activo: true,
                role: Role.TUTOR
            },
            {
                nombre: "Sofía",
                apellidos: "Ramírez",
                email: "sofia@edulink.com",
                password: passwordHasheada,
                telefono: "88885555",
                activo: true,
                role: Role.TUTOR
            },
            {
                nombre: "Laura",
                apellidos: "Jiménez",
                email: "laura@edulink.com",
                password: passwordHasheada,
                telefono: "88886666",
                activo: true,
                role: Role.USER
            },
            {
                nombre: "David",
                apellidos: "Vargas",
                email: "david@edulink.com",
                password: passwordHasheada,
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

    const categoriaMap = Object.fromEntries(
        cats.map(c => [c.nombre, c.id])
    );

    const especialidadMap = Object.fromEntries(
        especs.map(e => [e.nombre, e.id])
    );

    const usuarioMap = Object.fromEntries(
        users.map(u => [u.email, u.id])
    );

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
    })

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
    })

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
    })

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
    })

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
    })
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
    })

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
    })

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
    })
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
    })

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
    })
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
    })

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
    })
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
    })

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
    })
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
    })
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
    })
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
    })


    // 6. Creación de Citas (fechas relativas al momento de ejecutar el seed,
    // para que "pasado" y "futuro" sigan siendo correctos sin importar cuándo se corra).
    // Se anclan a medianoche UTC (no hora local) para coincidir con como el
    // resto del sistema interpreta fechaCita y evitar corrimientos de un día.
    const diasDesdeHoy = (n: number) => {
        const ahora = new Date();
        return new Date(Date.UTC(ahora.getUTCFullYear(), ahora.getUTCMonth(), ahora.getUTCDate() + n));
    };
    const horasAntesDeAhora = (n: number) => new Date(Date.now() - n * 60 * 60 * 1000);

    const cita1 = await prisma.cita.create({
        data: {
            clienteId: usuarioMap["laura@edulink.com"],
            tutorId: tutorAna.id,
            servicioId: servicioJava.id,
            fechaCita: diasDesdeHoy(5),
            horaInicio: "08:00",
            horaFin: "10:00",
            modalidad: Modalidad.VIRTUAL,
            estado: EstadoCita.PENDIENTE,
            comentarioCliente: "Necesito reforzar conceptos de programación orientada a objetos.",
            montoEstimado: 12000
        }
    })

    // Traslape intencional con cita1: mismo tutor, misma fecha, horario cruzado (08:00-10:00 vs 09:00-11:00)
    const cita2 = await prisma.cita.create({
        data: {
            clienteId: usuarioMap["david@edulink.com"],
            tutorId: tutorAna.id,
            servicioId: servicioJavaScript.id,
            fechaCita: diasDesdeHoy(5),
            horaInicio: "09:00",
            horaFin: "11:00",
            modalidad: Modalidad.VIRTUAL,
            estado: EstadoCita.PENDIENTE,
            comentarioCliente: "Repasar funciones y callbacks.",
            montoEstimado: 13000
        }
    })

    const cita3 = await prisma.cita.create({
        data: {
            clienteId: usuarioMap["laura@edulink.com"],
            tutorId: tutorAna.id,
            servicioId: servicioBD.id,
            fechaCita: diasDesdeHoy(1),
            horaInicio: "17:00",
            horaFin: "19:00",
            modalidad: Modalidad.MIXTA,
            estado: EstadoCita.PENDIENTE,
            comentarioCliente: "Necesito ayuda con consultas SQL.",
            montoEstimado: 14000
        }
    })

    const cita4 = await prisma.cita.create({
        data: {
            clienteId: usuarioMap["david@edulink.com"],
            tutorId: tutorCarlos.id,
            servicioId: servicioAlgebra.id,
            fechaCita: diasDesdeHoy(7),
            horaInicio: "08:00",
            horaFin: "09:30",
            modalidad: Modalidad.PRESENCIAL,
            estado: EstadoCita.PENDIENTE,
            comentarioCliente: "Preparación para examen de álgebra.",
            montoEstimado: 10000
        }
    })

    // Aceptada y futura: puede cancelarse para probar esa regla
    const cita5 = await prisma.cita.create({
        data: {
            clienteId: usuarioMap["laura@edulink.com"],
            tutorId: tutorCarlos.id,
            servicioId: servicioCalculo.id,
            fechaCita: diasDesdeHoy(10),
            horaInicio: "10:00",
            horaFin: "12:00",
            modalidad: Modalidad.MIXTA,
            estado: EstadoCita.ACEPTADA,
            comentarioCliente: "Repasar integrales definidas.",
            comentarioTutor: "Perfecto, nos vemos en la sesión.",
            montoEstimado: 12000
        }
    })

    const cita6 = await prisma.cita.create({
        data: {
            clienteId: usuarioMap["david@edulink.com"],
            tutorId: tutorMaria.id,
            servicioId: servicioInglesConversacional.id,
            fechaCita: diasDesdeHoy(3),
            horaInicio: "13:00",
            horaFin: "14:00",
            modalidad: Modalidad.VIRTUAL,
            estado: EstadoCita.ACEPTADA,
            comentarioCliente: "Práctica de conversación.",
            comentarioTutor: "Con gusto, preparo ejercicios de conversación.",
            montoEstimado: 10000
        }
    })

    const cita7 = await prisma.cita.create({
        data: {
            clienteId: usuarioMap["laura@edulink.com"],
            tutorId: tutorMaria.id,
            servicioId: servicioInglesEmpresarial.id,
            fechaCita: diasDesdeHoy(2),
            horaInicio: "15:00",
            horaFin: "16:30",
            modalidad: Modalidad.VIRTUAL,
            estado: EstadoCita.RECHAZADA,
            comentarioCliente: "Preparación para entrevista laboral.",
            comentarioTutor: "No tengo disponibilidad esa semana, por favor reprograme.",
            montoEstimado: 12000
        }
    })

    // Completada (pasada) con reseña
    const cita8 = await prisma.cita.create({
        data: {
            clienteId: usuarioMap["david@edulink.com"],
            tutorId: tutorJose.id,
            servicioId: servicioFisica.id,
            fechaCita: diasDesdeHoy(-3),
            horaInicio: "09:00",
            horaFin: "11:00",
            modalidad: Modalidad.PRESENCIAL,
            estado: EstadoCita.COMPLETADA,
            comentarioCliente: "Resolver ejercicios de mecánica.",
            comentarioTutor: "Sesión realizada sin inconvenientes.",
            montoEstimado: 13000
        }
    })

    // Completada (pasada) SIN reseña todavía
    const cita9 = await prisma.cita.create({
        data: {
            clienteId: usuarioMap["laura@edulink.com"],
            tutorId: tutorJose.id,
            servicioId: servicioQuimica.id,
            fechaCita: diasDesdeHoy(-5),
            horaInicio: "14:00",
            horaFin: "16:00",
            modalidad: Modalidad.PRESENCIAL,
            estado: EstadoCita.COMPLETADA,
            comentarioCliente: "Repasar balanceo de ecuaciones.",
            comentarioTutor: "Sesión realizada sin inconvenientes.",
            montoEstimado: 13000
        }
    })

    // Completada (pasada) con reseña
    const cita10 = await prisma.cita.create({
        data: {
            clienteId: usuarioMap["david@edulink.com"],
            tutorId: tutorSofia.id,
            servicioId: servicioPiano.id,
            fechaCita: diasDesdeHoy(-10),
            horaInicio: "10:00",
            horaFin: "11:30",
            modalidad: Modalidad.PRESENCIAL,
            estado: EstadoCita.COMPLETADA,
            comentarioCliente: "Introducción al piano.",
            comentarioTutor: "Sesión realizada sin inconvenientes.",
            montoEstimado: 11000
        }
    })

    const cita11 = await prisma.cita.create({
        data: {
            clienteId: usuarioMap["laura@edulink.com"],
            tutorId: tutorCarlos.id,
            servicioId: servicioAlgebra.id,
            fechaCita: diasDesdeHoy(-2),
            horaInicio: "18:00",
            horaFin: "19:30",
            modalidad: Modalidad.PRESENCIAL,
            estado: EstadoCita.CANCELADA,
            comentarioCliente: "Repaso general para examen final.",
            montoEstimado: 10000
        }
    })

    // Aceptada cuya fecha ya pasó: lista para marcarse como Completada
    const cita12 = await prisma.cita.create({
        data: {
            clienteId: usuarioMap["david@edulink.com"],
            tutorId: tutorSofia.id,
            servicioId: servicioPiano.id,
            fechaCita: diasDesdeHoy(-1),
            horaInicio: "14:00",
            horaFin: "15:30",
            modalidad: Modalidad.PRESENCIAL,
            estado: EstadoCita.ACEPTADA,
            comentarioCliente: "Repaso de escalas y acordes básicos.",
            comentarioTutor: "Perfecto, ya está confirmada.",
            montoEstimado: 11000
        }
    })

    // Completada (pasada) con reseña
    const cita13 = await prisma.cita.create({
        data: {
            clienteId: usuarioMap["david@edulink.com"],
            tutorId: tutorAna.id,
            servicioId: servicioJava.id,
            fechaCita: diasDesdeHoy(-7),
            horaInicio: "16:00",
            horaFin: "18:00",
            modalidad: Modalidad.VIRTUAL,
            estado: EstadoCita.COMPLETADA,
            comentarioCliente: "Repasar colecciones y streams.",
            comentarioTutor: "Sesión realizada sin inconvenientes.",
            montoEstimado: 12000
        }
    })

    // 7. Historial de cambios de estado (citas que ya salieron de Pendiente)
    await prisma.historialCita.createMany({
        data: [
            { citaId: cita5.id, estadoAnterior: EstadoCita.PENDIENTE, estadoNuevo: EstadoCita.ACEPTADA, motivo: "Aceptada por el profesional.", fecha: horasAntesDeAhora(48) },
            { citaId: cita6.id, estadoAnterior: EstadoCita.PENDIENTE, estadoNuevo: EstadoCita.ACEPTADA, motivo: "Aceptada por el profesional.", fecha: horasAntesDeAhora(30) },
            { citaId: cita7.id, estadoAnterior: EstadoCita.PENDIENTE, estadoNuevo: EstadoCita.RECHAZADA, motivo: "No tengo disponibilidad esa semana, por favor reprograme.", fecha: horasAntesDeAhora(20) },
            { citaId: cita8.id, estadoAnterior: EstadoCita.PENDIENTE, estadoNuevo: EstadoCita.ACEPTADA, motivo: "Aceptada por el profesional.", fecha: horasAntesDeAhora(96) },
            { citaId: cita8.id, estadoAnterior: EstadoCita.ACEPTADA, estadoNuevo: EstadoCita.COMPLETADA, motivo: "Sesión realizada.", fecha: horasAntesDeAhora(70) },
            { citaId: cita9.id, estadoAnterior: EstadoCita.PENDIENTE, estadoNuevo: EstadoCita.ACEPTADA, motivo: "Aceptada por el profesional.", fecha: horasAntesDeAhora(140) },
            { citaId: cita9.id, estadoAnterior: EstadoCita.ACEPTADA, estadoNuevo: EstadoCita.COMPLETADA, motivo: "Sesión realizada.", fecha: horasAntesDeAhora(118) },
            { citaId: cita10.id, estadoAnterior: EstadoCita.PENDIENTE, estadoNuevo: EstadoCita.ACEPTADA, motivo: "Aceptada por el profesional.", fecha: horasAntesDeAhora(260) },
            { citaId: cita10.id, estadoAnterior: EstadoCita.ACEPTADA, estadoNuevo: EstadoCita.COMPLETADA, motivo: "Sesión realizada.", fecha: horasAntesDeAhora(238) },
            { citaId: cita11.id, estadoAnterior: EstadoCita.PENDIENTE, estadoNuevo: EstadoCita.CANCELADA, motivo: "El cliente canceló por motivos personales.", fecha: horasAntesDeAhora(60) },
            { citaId: cita12.id, estadoAnterior: EstadoCita.PENDIENTE, estadoNuevo: EstadoCita.ACEPTADA, motivo: "Aceptada por el profesional.", fecha: horasAntesDeAhora(30) },
            { citaId: cita13.id, estadoAnterior: EstadoCita.PENDIENTE, estadoNuevo: EstadoCita.ACEPTADA, motivo: "Aceptada por el profesional.", fecha: horasAntesDeAhora(190) },
            { citaId: cita13.id, estadoAnterior: EstadoCita.ACEPTADA, estadoNuevo: EstadoCita.COMPLETADA, motivo: "Sesión realizada.", fecha: horasAntesDeAhora(166) },
        ]
    })

    // 8. Reseñas (cita9 queda completada sin reseña, para distinguir ambos casos)
    await prisma.resena.createMany({
        data: [
            {
                citaId: cita8.id,
                clienteId: usuarioMap["david@edulink.com"],
                tutorId: tutorJose.id,
                puntuacion: 5,
                comentario: "Excelente explicación, muy paciente y claro con los conceptos de mecánica."
            },
            {
                citaId: cita10.id,
                clienteId: usuarioMap["david@edulink.com"],
                tutorId: tutorSofia.id,
                puntuacion: 4,
                comentario: "Buena introducción al piano, aunque me hubiera gustado más tiempo de práctica."
            },
            {
                citaId: cita13.id,
                clienteId: usuarioMap["david@edulink.com"],
                tutorId: tutorAna.id,
                puntuacion: 3,
                comentario: "Estuvo bien, pero esperaba más profundidad en el tema de streams."
            }
        ]
    })

    console.log("Seed completado con éxito.");
    console.log(`Todos los usuarios semilla usan la contraseña: ${PASSWORD_SEMILLA}`);
}

main()
    .catch((e) => {
        console.error("Error en seed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    }); 