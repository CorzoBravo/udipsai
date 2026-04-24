import api from "../api/api";

export interface FichaSocioeconomica {
  id: number;

  paciente: {
    id: number;
    nombresApellidos: string;
    cedula: string;
  };

  especialista: {
    id: number;
    nombresApellidos: string;
  };

  situacionEconomica: {
    totalIngresos: number;
    totalEgresos: number;
    condicionEconomica: string;
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