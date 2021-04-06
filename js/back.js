const botones = document.querySelector('#botones')
const nombreUsuario = document.querySelector('#nombreUsuario')
const matricula = document.querySelector('#matricula')
const contenidoProtegido = document.querySelector('#contenidoProtegido')  
const formulario = document.querySelector('#formu') 
const inputChat= document.querySelector('#inputChat')

firebase.auth().onAuthStateChanged(user => {
    if(user){
        console.log(user)
        nombreUsuario.innerHTML = user.displayName
        matricula.innerHTML = user.uid
        accionCerrarSesion()
        formulario.classList= 'input-group py-3 fixed-bottom container'       
        contenidoProtegido.innerHTML = /*html*/`
        <p class="text-center lead mt-5 text-light">Bienvenido ${user.email}</p>`
        contenidoChat(user)
    }else{
        accionAcceder()
        console.log('usuario no registrado')
        nombreUsuario.innerHTML = 'Chat'
        formulario.classList= 'input-group py-3 fixed-bottom container d-none'
        contenidoProtegido.innerHTML = /*html*/`
            <p class="lead mt-5 text-center text-light">Debes iniciar sesión</p>`
        contenidoProtegido.innerHTML = /*html*/`
        <p class="text-center lead mt-5 text-light">Debes iniciar sesion</p>`

}
})

const contenidoChat = (user) => {

    formulario.addEventListener('submit', event => {
        event.preventDefault()
        console.log(inputChat.value)
        if(!inputChat.value.trim()){
            console.log('texto vacio')
            return
        }
        firebase.firestore().collection('chat').add({
            texto: inputChat.value,
            uid: user.uid,
            fecha: Date.now()
        }).then(res => {
            console.log('Mensaje guardado')
        })
        inputChat.value = ''
    })

    firebase.firestore().collection('chat').orderBy('fecha')
        .onSnapshot(query => {
            query.forEach(doc => {
                if(user.uid === doc.data().uid){
                    contenidoProtegido.innerHTML += /*html*/`
                    <div class="d-flex justify-content-end mb-2">
                        <span class="badge badge-primary">
                            ${doc.data().texto}
                        </span>
                    </div>
                    `
                }else{
                    contenidoProtegido.innerHTML += /*html*/`
                    <div class="d-flex justify-content-start mb-2">
                        <span class="badge badge-secondary">${doc.data().texto}</span>
                    </div>
                    `
                }
                contenidoProtegido.scrollTop = contenidoProtegido.scrollHeight
            })
        })

}
const accionAcceder = () => {

    botones.innerHTML = /*html*/`
        <button class="btn btn-outline-success" id="btnAcceder">Acceder</button>
    `
    
    const btnAcceder = document.querySelector('#btnAcceder')
    
    btnAcceder.addEventListener('click', async() => {
        console.log('entro')
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            await firebase.auth().signInWithPopup(provider)
        } catch (error) {
            console.log(error)
        }
    })

}

const accionCerrarSesion = () => {
    botones.innerHTML = /*html*/`
        <button class="btn btn-outline-danger" id="btnCerrar">Cerrar Sesión</button>
    `
    const btnCerrar = document.querySelector('#btnCerrar')
    btnCerrar.addEventListener('click', () => firebase.auth().signOut())
}
