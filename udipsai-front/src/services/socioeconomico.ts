import api from "../api/api";

export interface FichaSocioeconomica {
    id: number;
    fechaElaboracion: string;
    lugarNacimiento: string;
    paciente: {
        id: number;
        nombresApellidos: string;
        fechaNacimiento: string;
        edad: number;
        cedula: string;
    };

    especialista: {
        id: number;
        nombresApellidos: string;
    };
    familiares: {
        relacion: string;
        nombresApellidos: string;
        edad: number;
        estadocivil: string;
        instruccion: string;
        ocupacion: string;
        parentesco: string;
        ingresoMensual: number;
    }[];

    riesgosFamiliares: {
        //Agregar los campos de tabaquismo, alcoholismo, drogadiccion, violencia intrafamiliar, problemas sociales, vulnerabilidades, migroExterior, lugarMigracion, tiempoMigracion, afectacionFamiliar
        tabaquismo: boolean;
        alcoholismo: boolean;
        drogadiccion: boolean;
        violenciaIntrafamiliar: boolean;
        problemasSociales: string;
        vulnerabilidades: string;
        migroExterior: boolean;
        lugarMigracion: string;
        tiempoMigracion: string;
        afectacionFamiliar: string;
    };

    vulnerabilidadesDetalle: {
        movilidadHumana: boolean;
        enfermedadCatastrofica: boolean;
        embarazoAdolescente: boolean;
        abusoSexual: boolean;
        agresionFisica: boolean;
        agresionPsicologica: boolean;
        lugarAgresion: string;
    };

    dinamicaFamiliar: {
        resolucionConflictos: string;
        quienesIncumplenReglas: string;
        actividadesCompartidas: string;
        relacionHermanos: string;
        relacionPadresHijos: string;
        comunicacionFamiliar: string;
        tipoHogar: string;
    };

    vivienda: {
        tipoTenencia: string;
        materialParedes: string;
        materialPiso: string;
        materialTecho: string;
        numeroCuartos: number;
        numeroDormitorios: number;
        numeroCamas: number;
        numeroSanitarios: number;
        tipoSanitario: string; // Agregar DTO
        procedenciaAgua: string;
        detalleElectricidad: string;
    };

    salud: {
        lugarAtencionMedica: string;
        saludEstudiante: string;
        ayudasTecnicas: string;
        problemasSaludFamiliares: string;
        enfermedadesCatastroficas: string;
        discapacidadFamiliares: string;
    };
    situacionEconomica: {
        totalIngresos: number;
        totalEgresos: number;
        condicionEconomica: string;
        capacidadGastoEvaluacion: string;
        actividadesTiempoLibre: string;
    };

    desgloseEconomico: {
        ingresoPadre: number;
        ingresoMadre: number;
        ingresoFamiliares: number;
        ingresoOtros: number;
        egresoAlimentacion: number;
        egresoArriendo: number;
        egresoServiciosBasicos: number;
        egresoSalud: number;
        egresoEducacion: number;
        egresoPrestamos: number;
        egresoOtros: number;
    };

    conclusiones: string;
    recomendaciones: string;
}


export const SocioEconomicoService = {

    async obtenerPorPaciente(pacienteId: number) {
        try {
            const res = await api.get(`/socioeconomicas/paciente/${pacienteId}`);
            return res.data;
        } catch (error) {
            console.error("Error al obtener ficha socioeconómica:", error);
            throw error;
        }
    },

    async crear(data: FichaSocioeconomica) {
        try {
            const res = await api.post(`/socioeconomicas`, data);
            return res.data;
        } catch (error) {
            console.error("Error al crear ficha socioeconómica:", error);
            throw error;
        }
    },

    async actualizar(id: number, data: FichaSocioeconomica) {
        try {
            const res = await api.put(`/socioeconomicas/${id}`, data);
            return res.data;
        } catch (error) {
            console.error("Error al actualizar ficha socioeconómica:", error);
            throw error;
        }
    },

    async eliminar(id: number) {
        try {
            await api.delete(`/socioeconomicas/${id}`);
            return true;
        } catch (error) {
            console.error("Error al eliminar ficha socioeconómica:", error);
            throw error;
        }
    },
};
