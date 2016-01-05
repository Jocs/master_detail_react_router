const _contacts = {}
const _changeListeners = []
const API = 'http://127.0.0.1:8080/contacts'
let isInited = false

const ContactStore = {
	init () {
		if( isInited ) {
			return
		}
		isInited = true

		getJSON(API, (err, contacts) => {
			if( err ) {
				console.log(err)
			}
			for(let id in contacts){
				if(contacts.hasOwnProperty(id)){
					_contacts[id] = contacts[id]
				}
			}
			ContactStore.notifiyChange();
		})
	},
	getContacts () {
		console.log(_contacts)
		const array = []
		for(let id in _contacts){
			if(_contacts.hasOwnProperty( id )){
				array.push( _contacts[ id ] )
			}
		}
		return array
	},

	getContact ( id ) {
		return _contacts[ id ]
	},

	removeContact ( id ) {
		removeJSON( `${API}/${id}`, (err, contact) => {
			delete _contacts[id]
			ContactStore.notifiyChange()
		})
	},

	addContact ( contact, cb ) {
		addJSON(API, contact, (err, contact) => {
			_contacts[contact.id] = contact
			if( cb ) {
				cb( contact )
			}
			ContactStore.notifiyChange()
		})	
	},

	notifiyChange () {
		_changeListeners.forEach( listener => listener())
	},

	addListener ( listener ) {
		_changeListeners.push( listener )
	},

	removeListener ( listener ) {
		_changeListeners.filter( l => listener !== l )
	}
}
//todo lists
function getToken () {
	if(!localStorage.getItem('token')) {
		localStorage.setItem('token', +new Date())
	} 
	return localStorage.getItem('token')
}

function getJSON (url, cb) {
	const req = new XMLHttpRequest()
	req.addEventListener('load', () => {
		if(req.status === 404) {
			cb( new Error('not found!'))
		} else {
			cb(null, JSON.parse(req.response))
		}
	})
	req.open('GET', url)
	req.setRequestHeader('authorization', getToken())
	req.send()

}
function removeJSON ( url, cb ) {
	const req = new XMLHttpRequest()
	req.addEventListener('load', () => {
		if(req.status === 404) {
			cb(new Error('remove contact error!'))
		} else {
			cb(null, JSON.parse(req.response))
		}
	})
	req.open('DELETE', url)
	req.setRequestHeader('authorization', getToken())
	req.send()
}
function addJSON (url, obj, cb) {
	const req = new XMLHttpRequest()
	req.addEventListener('load', () => {
		if(req.status === 404){
			cb(new Error('add contact error!'))
		} else {
			cb(null, JSON.parse(req.response))
		}
	})
	req.open('POST', url)
	req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
	req.setRequestHeader('authorization', getToken())
	req.send(JSON.stringify(obj))
}
export default ContactStore










