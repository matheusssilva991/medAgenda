const knex = require("../databases/Connection");
const EnderecoModel = require("./Endereco");
const UserModel = require("./User");
const TelefoneModel = require("./Telefone");

class Paciente {

    async new (nome, cpf, dataNascimento, endereco, telefone, user) {
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

            // Cria o paciente
            await knex.insert({ nome, cpf, data_nascimento: dataNascimento, id_tbl_endereco, id_tbl_telefone,
                                id_tbl_user}).table('tbl_paciente');
 
        } catch (err) {
            console.log(err);
        }
    }

    async findAll() {
        try {
            // To Do - Criar View view_paciente_telefone_endereco
            const result = await knex
                .select(["tbl_paciente.id as id", "nome", "email", "cpf", "data_nascimento as dataNascimento", "ddd", 
                "tbl_telefone.numero as numeroTelefone", "rua", "bairro", "tbl_endereco.numero as numeroCasa", 
                "complemento", "cidade", "nivel_permissao as nivelPermissao"])
                .from("tbl_paciente")
                .innerJoin("tbl_telefone", "tbl_paciente.id_tbl_telefone", "=", "tbl_telefone.id")
                .innerJoin("tbl_endereco", "tbl_paciente.id_tbl_endereco", "=", "tbl_endereco.id")
                .innerJoin("tbl_user", "tbl_paciente.id_tbl_user", "=", "tbl_user.id").orderBy("id", "asc");

            return result;
        } catch (err) {
            console.log(err);   
            return [];
        }
    }

    async findById(id){
        try {
            const result = await knex
                .select(["tbl_paciente.id as id", "nome", "email", "cpf", "data_nascimento as dataNascimento", "ddd", 
                "tbl_telefone.numero as numeroTelefone", "rua", "bairro", "tbl_endereco.numero as numeroCasa", 
                "complemento", "cidade", "nivel_permissao as nivelPermissao"])
                .from("tbl_paciente")
                .innerJoin("tbl_telefone", "tbl_paciente.id_tbl_telefone", "=", "tbl_telefone.id")
                .innerJoin("tbl_endereco", "tbl_paciente.id_tbl_endereco", "=", "tbl_endereco.id")
                .innerJoin("tbl_user", "tbl_paciente.id_tbl_user", "=", "tbl_user.id")
                .whereRaw(`tbl_paciente.id = ${id}`);
            
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
                .select("tbl_paciente.id", "nome", "email", "senha", "cpf", "data_nascimento as dataNascimento", 
                "ddd", "tbl_telefone.numero as numeroTelefone", "rua", "bairro", "tbl_endereco.numero as numeroCasa", 
                "complemento", "cidade", "nivel_permissao as nivelPermissao")
                .from("tbl_paciente")
                .innerJoin("tbl_telefone", "tbl_paciente.id_tbl_telefone", "=", "tbl_telefone.id")
                .innerJoin("tbl_endereco", "tbl_paciente.id_tbl_endereco", "=", "tbl_endereco.id")
                .innerJoin("tbl_user", "tbl_paciente.id_tbl_user", "=", "tbl_user.id")
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

    async findConsultas (id) {
        try {
            const consultas = await ConsultaModel.findAll();
            const result = consultas.filter(consulta => consulta.id_tbl_paciente == id);

            return result;
        } catch(err) {
            console.log(err);   
            return [];
        }
    }

    async cpfExists(cpf) {
        try {
            const result = await knex.select("*").from("tbl_paciente").where({ cpf });

            if (result.length > 0)
                return true;
            else
                return false;
        } catch (err) {
            console.log(err);
            return false
        }
    }

    async update(id, nome, cpf, dataNascimento, endereco, telefone, user){
        const paciente = await this.findById(id);

        if (paciente != undefined){
            const editPaciente = {};

            // Verifica se o cpf não é undefined e atualiza caso já não exista
            if(cpf != undefined){
                if(cpf != paciente.cpf){
                    const result = await this.cpfExists(cpf);

                    if (result)
                        return { status: false, err: "O cpf já está cadastrado." };

                    editPaciente.cpf = cpf || paciente.cpf;
                }
            }

            // Atualiza o paciente
            editPaciente.nome = nome || paciente.nome;
            editPaciente.data_nascimento = dataNascimento || paciente.dataNascimento; 

            try {
                await knex.update(editPaciente).where({id: id}).table("tbl_paciente");
            } catch (err) {
                return { status: false, err: err }
            }

            // Atualiza o endereco
            const idEndereco = await EnderecoModel.getId(paciente.rua, paciente.bairro, paciente.numeroCasa)
            const enderecoCheck = await EnderecoModel.findById(idEndereco);

            if (enderecoCheck != undefined) {
                const result = await EnderecoModel
                                        .update(enderecoCheck.id, endereco.rua, endereco.bairro, endereco.numero, 
                                                endereco.complemento, endereco.cidade);  

                if (!result.status)
                    return { status: false, err: result.err};
            }

            // Atualiza o telefone 
            const idTelefone = await TelefoneModel.getId(paciente.ddd, paciente.numeroTelefone)
            const telefoneCheck = await TelefoneModel.findById(idTelefone);

            if (telefoneCheck != undefined) {
                const result = await TelefoneModel.update(telefoneCheck.id, telefone.ddd, telefone.numero); 

                if (!result.status)
                    return { status: false, err: result.err};
            }

            // Atualizar o user
            const userCheck = await UserModel.findByEmail(paciente.email);

            if (userCheck != undefined) {
                const result = await UserModel.update(userCheck.id, user.email, user.senha, user.nivelPermissao); 

                if (!result.status)
                    return { status: false, err: result.err};
            }

            return { status: true }

        } else
            return { status : false, err: "O paciente não existe." };
    }

    async delete (id){
        const paciente = await this.findById(id);
        
        if (paciente != undefined){
            const user = await UserModel.findByEmail(paciente.email);

            try {
                await knex.delete().where({ id: id }).table("tbl_paciente");
                await UserModel.delete(user.id);
                return { status: true }
            }
            catch (err) {
                return { status: false, err: err }  
            }
                
        } else 
            return { status: false, err: "O paciente não existe, portanto não pode ser deletado." }    
   }

}

module.exports = new Paciente();
