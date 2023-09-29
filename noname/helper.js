import { mostrarAlert } from '../../../../components/alerts/showAlert'
import axios from '../../../../api/axios'
import { validarCampos } from '../../../../components/validator/validator'


const urlGet = 'user/obtener';
const urlDelete = '/user/eliminar/';
const urlPost = '/user/crear';
const urlPut = '/user/actualizar/';

const urlType = '/type/obtener';
const urlCategory = '/category/obtener';


const config = {
    headers: { Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwicm9sIjoiYWRtaW4ifQ.mnk6KCpDFetRRbinXXYttNwDLDnP_JmbpBB9pep45N4` }
};

//peticion GET
export const getAllRequest = async (setDatos) => {
    await axios.get(urlGet, config)
        .then(response => {
            const data = response.data.clientes
            console.log(data);
            setDatos(data);
        }).catch(error => {
            if (!error?.response) {
                mostrarAlert("Sin respuesta del servidor!", "Comuníquese con soporte técnico", "error")
                return
            } else if (error.response?.status === 500) {
                mostrarAlert("Sin respuesta del servidor!", "Comuníquese con soporte técnico", "error")
            }
        })
}

//Peticion GET para llenar las opciones de dropdown
export const typeRequest = async (setTipos) => {
    await axios.get(urlType, config)
        .then(response => {
            const data = response.data
            setTipos(data.types)
        }).catch(error => {
            if (!error?.response) {
                mostrarAlert("Error al cargar tipos de usuario!", "Comuníquese con soporte técnico", "error")
                return
            } else if (error.response?.status === 500) {
                mostrarAlert("Sin conexión al servidor!", "Comuníquese con soporte técnico", "error")
            }
        })
}

//peticion DELETE
export const deleteRequest = async (setIdEliminar, setDatos) => {

    await axios.delete(urlDelete + setIdEliminar, config)
        .then(response => {
            getAllRequest(setDatos)
            mostrarAlert("Operación exitosa!", "Se ha eliminado correctamente", "success")
        }).catch(error => {
            if (!error?.response) {
                mostrarAlert("Eliminación fallida!", "Comuníquese con soporte técnico", "error")
                return
            }
        })
}

//Peticion POST
export const postRequest = async (id_type, datos, setDatos, setAgregar) => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value;
    const lastname = document.getElementById('lastname').value;
    const phone = document.getElementById('phone').value;
    const rfc = document.getElementById('rfc').value;


    if (validarCampos(username) || validarCampos(password) || validarCampos(name) || validarCampos(lastname) || validarCampos(phone) || validarCampos(rfc)) {
        mostrarAlert('Campos vacíos!', 'Debes completar todos los datos', 'warning')
        return
    }

    if (id_type == '') {
        mostrarAlert('Selecciona un tipo de usuario!', 'Debes completar todos los datos', 'warning')
        return
    }

    if (phone.length <= 6 || phone.length >= 11) {
        mostrarAlert('Numero de teléfono inválido', 'Por favor ingresa nuevamente el número', 'warning')
        return
    }

    if (rfc.length <= 12 || rfc.length >= 14) {
        mostrarAlert('Formato de RFC incorrecto!', 'Por favor ingresa un RFC válido', 'warning')
        return
    }

    try {
        const response = await axios.post(urlPost,
            {
                id_type: id_type,
                username: username,
                password: password,
                name: name,
                lastname: lastname,
                phone: phone,
                rfc: rfc
            },
            config
        )
        setAgregar(false)
        setDatos([response.data.usuario, ...datos])
        mostrarAlert("Operación exitosa!", "Usuario registrado correctamente", "success");
    } catch (error) {
        if (!error?.response) {
            mostrarAlert("No se pudo completar el registro!", "Comuníquese con soporte técnico", "error")
            return
        } else if (error.response?.status === 500) {
            mostrarAlert("Sin conexión al servidor!", "Comuníquese con soporte técnico", "error")
        }
        else if (error.response?.status === 400) {

            mostrarAlert(error.response.data.errores[0].msg + '!', "Verifique los datos ingresados", "error")
        } else if (error.response?.status === 401) {

            mostrarAlert('Error de token!', "Comuniquese con soporte técnico", "error")
        }
    }
}



export const getOneRequest = async (id_user) => {
    await axios.get(urlGet + '/' + id_user, config)
        .then(response => {
            const data = response.data
            const upsType = document.getElementById('tipo-edt').value = data.user.type;
            const upsUsername = document.getElementById('username-edt').value = data.user.username;
            const upsName = document.getElementById('name-edt').value = data.user.name;
            const upsLastname = document.getElementById('lastname-edt').value = data.user.lastname;
            const upsPhone = document.getElementById('phone-edt').value = data.user.phone;
            const upsRfc = document.getElementById('rfc-edt').value = data.user.rfc;
        }).catch(error => {
            if (!error?.response) {
                mostrarAlert("Los datos no se pudieron cargar!", "Comuníquese con soporte técnico", "error")
                return
            } else if (error.response?.status === 500) {
                mostrarAlert("Sin respuesta del servidor!", "Comuníquese con soporte técnico", "error")
            }
            else if (error.response?.status === 400) {

                mostrarAlert(error.response.data.errores[0].msg + '!', "Usuario no encontrado", "error")
            }
        })
}



export const UpSertRequest = async (id_user, setEditar, setDatos) => {
    const upsUsername = document.getElementById('username-edt').value;
    const upsName = document.getElementById('name-edt').value;
    const upsLastname = document.getElementById('lastname-edt').value;
    const upsPhone = document.getElementById('phone-edt').value;
    const upsRfc = document.getElementById('rfc-edt').value;
    const upsdatePicker = document.getElementById('datePicker').value;
    
    if (validarCampos(upsUsername) || validarCampos(upsName) || validarCampos(upsLastname) || validarCampos(upsPhone) || validarCampos(upsRfc)) {
        mostrarAlert('Información incompleta!', 'No debes dejar campos vacíos!', 'warning')
        return
    }
    if (upsPhone.length <= 6 || upsPhone.length >= 11) {
        mostrarAlert('Numero de teléfono inválido', 'Por favor ingresa nuevamente el número', 'warning')
        return
    }

    if (upsRfc.length <= 12 || upsRfc.length >= 14) {
        mostrarAlert('Formato de RFC incorrecto!', 'Por favor ingresa un RFC válido', 'warning')
        return
    }

    try {
        const response = await axios.put(urlPut+id_user,
            {
                username: upsUsername,
                name: upsName,
                lastname: upsLastname,
                phone: upsPhone,
                rfc: upsRfc
            },
            config
        )
        setEditar(false)
        mostrarAlert("Operación exitosa!", "Datos actualizados correctamente", "success");
        getAllRequest(setDatos)
    } catch (error) {
        if (!error?.response) {
            mostrarAlert("No se pudo completar la actualización!", "Comuníquese con soporte técnico", "error")
            return
        } else if (error.response?.status === 500) {
            mostrarAlert("Sin conexión al servidor!", "Comuníquese con soporte técnico", "error")
        }
        else if (error.response?.status === 400) {
            mostrarAlert(error.response.data.errores[0].msg + '!', "Verifique los datos ingresados", "error")
        } else if (error.response?.status === 401) {
            mostrarAlert('Error de token!', "Comuniquese con soporte técnico", "error")
        }
    }
}

