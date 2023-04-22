const Medico = require("../models/Medico");
const User = require("../models/User");
const Clinica = require("../models/Clinica");
const HorarioAtendimento = require("../models/HorarioAtendimento");
const dotenv = require("dotenv").config();
const validator = require("validator");

class MedicoController {

    async index (req, res) {
        const medicos = await Medico.findAll();
        res.json(medicos);
        return;
    }

    async findMedico(req, res){
        const id = req.params.id;
        const medico = await Medico.findById(id);

        if(medico == undefined){
            res.status(404); // Not finding
            res.json({});
            return;
        } else {
            res.status(200) // Sucess
            res.json(medico);
            return;
        }
    }

    async findClinicaMedicos(req, res){
        const id = req.params.id;
        const medicos = await Medico.findByClinica(id);

        res.json(medicos);
        return;
    }

    async create(req, res){
        const { nome, cpf, dataNascimento, crm, especialidade, idClinica } = req.body;

        const { rua, bairro, numeroCasa, complemento, cidade } = req.body;
        const endereco = { rua, bairro, numero: numeroCasa, complemento, cidade };

        const { ddd, numeroTelefone } = req.body;
        const telefone = { ddd, numero: numeroTelefone };

        const { email, senha } = req.body;
        const user = { email, senha };
        
        if(!validator.isEmail(email)){
            res.status(400);
            res.json({ err: "O e-mail é invalido!." });
            return;
        }

        const emailExists = await User.emailExists(email);
        if (emailExists){
            res.status(406);
            res.json({ err: "O e-mail já está cadastrado!." });
            return;
        }

        const cpfExists = await Medico.cpfExists(cpf);
        if (cpfExists){
            res.status(406);
            res.json({ err: "O cpf já está cadastrado!." });
            return;
        }

        const crmExists = await Medico.crmExists(crm);
        if (crmExists){
            res.status(406);
            res.json({ err: "O crm já está cadastrado!." });
            return;
        }

        if (!validator.isStrongPassword(senha)) {
            res.status(400);
            res.json({ err: "Senha fraca!." });
            return;
        }

        const clinica = await Clinica.findById(idClinica);
        if (clinica == undefined){
            res.status(400);
            res.json({ err: "O número da clinica é inválida." });
            return;
        }

        await Medico.new(nome, cpf, dataNascimento, crm, especialidade, endereco, telefone, user, idClinica);

        res.status(200);
        res.send("Tudo Ok!");
        return;
    }

    async edit(req, res){
        const id = req.params.id;
        const { nome, cpf, dataNascimento, crm, especialidade, idClinica } = req.body;

        const { rua, bairro, numeroCasa, complemento, cidade } = req.body;
        const endereco = { rua, bairro, numero: numeroCasa, complemento, cidade };

        const { ddd, numeroTelefone } = req.body;
        const telefone = { ddd, numero: numeroTelefone };

        const { email, senha } = req.body;
        const user = { email, senha };
        
        const result = await Medico.update(id, nome, cpf, dataNascimento, crm, especialidade, endereco, telefone,
                                           user, idClinica);

        if (result != undefined){
            if (result.status){
                res.status(200);
                res.send("Tudo OK.");
                return;
            } else {
                res.status(406);
                res.send(result.err);
                return;
            }
        } else {
            res.status(406);
            res.send("Ocorreu um error no servidor!");
            return;
        }
    }

    async remove (req, res) {
        const id = req.params.id;
        const result = await Medico.delete(id);

        if (result.status){
            res.status(200);
            res.send("Tudo OK!");
            return;
        } else {
            res.status(406);
            res.send(result.err);
            return;
        }
    }
}

module.exports = new MedicoController();
