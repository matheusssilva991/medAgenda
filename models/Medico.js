const knex = require("../databases/Connection");
const EnderecoModel = require("./Endereco");
const UserModel = require("./User");
const TelefoneModel = require("./Telefone");
const HorarioAtendimentoModel = require("./HorarioAtendimento");
const ConsultaModel = require("./Consulta");

class Medico {

    async new (nome, cpf, dataNascimento, crm, especialidade, endereco, telefone, user, idClinica) {
        try {
            
            // Cria ou não o endereco pega o seu id
            if (!await EnderecoModel.checkExists(endereco)) {
                const { rua, bairro, numero, complemento, cidade } = endereco;
                await EnderecoModel.new(rua, bairro, numero, complemento, cidade);
            }
            const id_tbl_endereco = await EnderecoModel.getId(endereco.rua, endereco.bairro, endereco.numero);

            // Cria ou não o telefone e pega o seu id
            if (!await TelefoneModel.checkExists(telefone)){
                const { ddd, numero } = telefone;
                await TelefoneModel.new(ddd, numero);
            }
            const id_tbl_telefone = await TelefoneModel.getId(telefone.ddd, telefone.numero);
            
            // Cria o usuário e pegar o seu id
            const { email, senha } = user;
            await UserModel.new(email, senha, 0);
            let id_tbl_user = await UserModel.findByEmail(user.email);
            id_tbl_user = id_tbl_user.id;

            // Cria o medico
            await knex.insert({ nome, cpf, data_nascimento: dataNascimento, crm, especialidade, 
                id_tbl_endereco, id_tbl_telefone, id_tbl_user, id_tbl_clinica: idClinica }).table('tbl_medico');
 
        } catch (err) {
            console.log(err);
        }
    }

    async findAll() {
        try {
            // To Do - Criar View view_medico_telefone_endereco
            const result = await knex
                .select("tbl_medico.id", "nome", "email", "cpf", "data_nascimento as dataNascimento", "crm", 
                "especialidade", "ddd", "tbl_telefone.numero as numeroTelefone", "rua", "bairro", 
                "tbl_endereco.numero as numeroCasa", "complemento", "cidade", "id_tbl_clinica as idClinica",
                "nivel_permissao as nivelPermissao")
                .from("tbl_medico")
                .innerJoin("tbl_telefone", "tbl_medico.id_tbl_telefone", "=", "tbl_telefone.id")
                .innerJoin("tbl_endereco", "tbl_medico.id_tbl_endereco", "=", "tbl_endereco.id")
                .innerJoin("tbl_user", "tbl_medico.id_tbl_user", "=", "tbl_user.id").orderBy("id", "asc");

            return result;
        } catch (err) {
            console.log(err);   
            return [];
        }
    }

    async findById(id){
        try {
            const result = await knex
                .select("tbl_medico.id", "nome", "email", "cpf", "data_nascimento as dataNascimento", "crm", 
                "especialidade", "ddd", "tbl_telefone.numero as numeroTelefone", "rua", "bairro", 
                "tbl_endereco.numero as numeroCasa", "complemento", "cidade", "id_tbl_clinica as idClinica",
                "nivel_permissao as nivelPermissao")
                .from("tbl_medico")
                .innerJoin("tbl_telefone", "tbl_medico.id_tbl_telefone", "=", "tbl_telefone.id")
                .innerJoin("tbl_endereco", "tbl_medico.id_tbl_endereco", "=", "tbl_endereco.id")
                .innerJoin("tbl_user", "tbl_medico.id_tbl_user", "=", "tbl_user.id")
                .whereRaw(`tbl_medico.id = ${id}`);
            
            if(result.length > 0)
                return result[0];
            else
                return undefined;

        } catch (err) {
            console.log(err);   
            return [];
        }
    }

    async findByEmail(email){
        try {
            const result = await knex
                .select("tbl_medico.id", "nome", "email", "senha", "cpf", "data_nascimento as dataNascimento", 
                "crm", "especialidade", "ddd", "tbl_telefone.numero as numeroTelefone", "rua", "bairro", 
                "tbl_endereco.numero as numeroCasa", "complemento", "cidade", "id_tbl_clinica as idClinica",
                "nivel_permissao as nivelPermissao")
                .from("tbl_medico")
                .innerJoin("tbl_telefone", "tbl_medico.id_tbl_telefone", "=", "tbl_telefone.id")
                .innerJoin("tbl_endereco", "tbl_medico.id_tbl_endereco", "=", "tbl_endereco.id")
                .innerJoin("tbl_user", "tbl_medico.id_tbl_user", "=", "tbl_user.id")
                .whereRaw(`email = ${email}`);
            
            if(result.length > 0)
                return result[0];
            else
                return undefined;

        } catch (err) {
            console.log(err);   
            return [];
        }
    }

    async findByClinica(id) {
        try {
            const medicos = await this.findAll();
            const result = medicos.filter(medico => medico.idClinica == id);

            return result;
        } catch(err) {
            console.log(err);   
            return [];
        }
    }

    async cpfExists(cpf) {
        try {
            const result = await knex.select("*").from("tbl_medico").where({ cpf });

            if (result.length > 0)
                return true;
            else
                return false;
        } catch (err) {
            console.log(err);
            return false
        }
    }

    async crmExists(crm) {
        try {
            const result = await knex.select("*").from("tbl_medico").where({ crm });

            if (result.length > 0)
                return true;
            else
                return false;
        } catch (err) {
            console.log(err);
            return false
        }
    }

    async findAvaliacoes (id) {
        try {
            const result = await knex.select(["tbl_avaliacao.id as id", "nota", "comentario"])
                .table("tbl_medico").innerJoin("tbl_consulta", "tbl_consulta.id_medico", "=", "tbl_medico.id")
                .innerJoin("tbl_avaliacao", "tbl_consulta.id", "=", "tbl_avaliacao.id_consulta")
                .where(`tbl_medico.id = ${id}`);

            return result;
        } catch(err) {
            console.log(err);   
            return [];
        }
    }

    async update(id, nome, cpf, dataNascimento, crm, especialidade, endereco, telefone, user, idClinica){
        const medico = await this.findById(id);

        if (medico != undefined){
            const editMedico = {};

            // Verifica se o cpf não é undefined e atualiza caso já não exista
            if(cpf != undefined){
                if(cpf != medico.cpf){
                    const result = await this.cpfExists(cpf);

                    if (result)
                        return { status: false, err: "O cpf já está cadastrado." };

                    editMedico.cpf = cpf || medico.cpf;
                }
            }

            // Verifica se o crm não é undefined e atualiza caso já não exista
            if(crm != undefined){
                if(crm != medico.crm){
                    const result = await this.crmExists(crm);

                    if (result)
                        return { status: false, err: "O crm já está cadastrado." };

                    editMedico.crm = crm || medico.crm;
                }
            }

            // Atualiza o medico
            editMedico.nome = nome || medico.nome;
            editMedico.data_nascimento = dataNascimento || medico.dataNascimento; 
            editMedico.especialidade = especialidade || medico.especialidade;
            editMedico.id_tbl_clinica = idClinica || medico.idClinica

            try {
                await knex.update(editMedico).where({id: id}).table("tbl_medico");
            } catch (err) {
                return { status: false, err: err }
            }

            // Atualiza o endereco
            const idEndereco = await EnderecoModel.getId(medico.rua, medico.bairro, medico.numeroCasa)
            const enderecoCheck = await EnderecoModel.findById(idEndereco);

            if (enderecoCheck != undefined) {
                const result = await EnderecoModel
                                        .update(enderecoCheck.id, endereco.rua, endereco.bairro, endereco.numero, 
                                                endereco.complemento, endereco.cidade);  

                if (!result.status)
                    return { status: false, err: result.err};
            }

            // Atualiza o telefone 
            const idTelefone = await TelefoneModel.getId(medico.ddd, medico.numeroTelefone)
            const telefoneCheck = await TelefoneModel.findById(idTelefone);

            if (telefoneCheck != undefined) {
                const result = await TelefoneModel.update(telefoneCheck.id, telefone.ddd, telefone.numero); 

                if (!result.status)
                    return { status: false, err: result.err};
            }

            // Atualizar o user
            const userCheck = await UserModel.findByEmail(medico.email);

            if (userCheck != undefined) {
                const result = await UserModel.update(userCheck.id, user.email, user.senha, user.nivelPermissao); 

                if (!result.status)
                    return { status: false, err: result.err};
            }

            return { status: true }

        } else
            return { status : false, err: "O medico não existe." };
    }

    async delete (id){
        const medico = await this.findById(id);

        if (medico != undefined){
            const user = await UserModel.findByEmail(medico.email);

            try {
                await knex.delete().where({ id: id }).table("tbl_medico");
                await UserModel.delete(user.id);
                await HorarioAtendimentoModel.deleteMedicoHorariosAtendimento(medico.id);
                return { status: true }
            }
            catch (err) {
                return { status: false, err: err }  
            }
                
        } else 
            return { status: false, err: "O medico não existe, portanto não pode ser deletado." }    
   }

}

module.exports = new Medico();
