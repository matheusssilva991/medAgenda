const express = require("express");
const app = express();
const router = express.Router();
const PacienteController = require("../controllers/PacienteController");
const MedicoController = require("../controllers/MedicoController");
const ClinicaController = require("../controllers/ClinicaController");
const HorarioAtendimentoController = require("../controllers/HorarioAtendimentoController");
const ConsultaController = require("../controllers/ConsultaController");
const LembreteController = require("../controllers/LembreteController");
const AvaliacaoController = require("../controllers/AvaliacaoController");

// Paciente
router.get("/pacientes", PacienteController.index);
router.get("/pacientes/:id", PacienteController.findPaciente);
router.post("/pacientes", PacienteController.create);
router.put("/pacientes/:id", PacienteController.edit);
router.delete("/pacientes/:id", PacienteController.remove);

// Medico
router.get("/medicos", MedicoController.index);
router.get("/medicos/:id", MedicoController.findMedico);
router.get("/clinicas/:id/medicos", MedicoController.findClinicaMedicos);
router.post("/medicos", MedicoController.create);
router.put("/medicos/:id", MedicoController.edit);
router.delete("/medicos/:id", MedicoController.remove);

// Horarios Atendimento
router.get("/horarios-atendimento", HorarioAtendimentoController.index);
router.get("/horarios-atendimento/:id", HorarioAtendimentoController.findHorarioAtendimento);
router.get("/medicos/:id/horarios-atendimento", HorarioAtendimentoController.findMedicoHorariosAtendimento);
router.post("/horarios-atendimento", HorarioAtendimentoController.create);
router.put("/horarios-atendimento/:id", HorarioAtendimentoController.edit);
router.delete("/horarios-atendimento/:id", HorarioAtendimentoController.remove);

// Consulta 
router.get("/consultas", ConsultaController.index);
router.get("/consultas/:id", ConsultaController.findConsulta);
router.get("/pacientes/:id/consultas", ConsultaController.findPacienteConsultas);
router.get("/medicos/:id/consultas", ConsultaController.findMedicoConsultas);
router.post("/consultas", ConsultaController.create);
router.put("/consultas/:id", ConsultaController.edit);
router.delete("/consultas/:id", ConsultaController.remove);

// Clinica
router.get("/clinicas", ClinicaController.index);
router.get("/clinicas/:id", ClinicaController.findClinica);
router.post("/clinicas", ClinicaController.create);
router.put("/clinicas/:id", ClinicaController.edit);
router.delete("/clinicas/:id", ClinicaController.remove);

// Lembrete
router.get("/lembretes", LembreteController.index);
router.get("/lembretes/:id", LembreteController.findLembrete);
router.get("/pacientes/:id/lembretes", LembreteController.findPacienteLembretes);
router.post("/lembretes", LembreteController.create);
router.put("/lembretes/:id", LembreteController.edit);
router.delete("/lembretes/:id", LembreteController.remove);

// Avaliacão
router.get("/avaliacoes", AvaliacaoController.index);
router.get("/avaliacoes/:id", AvaliacaoController.findAvaliacao);
router.get("/medicos/:id/avaliacoes", AvaliacaoController.findMedicoAvaliacoes);
router.post("/avaliacoes", AvaliacaoController.create);
router.put("/avaliacoes/:id", AvaliacaoController.edit);
router.delete("/avaliacoes/:id", AvaliacaoController.remove);

module.exports = router;
