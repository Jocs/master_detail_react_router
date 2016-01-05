import React, { Component } from 'react'
import { render, findDOMNode } from 'react-dom'
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router'
import ContactStore from './ContactStore'

import './app.css'

class App extends Component {
	constructor (props){
		super(props)
		this.state = {
			contacts: ContactStore.getContacts(),
			isMounted: false
		} 
	}
	
	componentDidMount () {
		this.state.isMounted = true
		ContactStore.addListener(this.updateState.bind(this))
		ContactStore.init()
	}
	componentWillUnmount () {
		ContactStore.removeListener(this.updateState.bind(this))
		this.state.isMounted = false
	}
	updateState () {
		if(!this.state.isMounted) {
			return
		}
		this.setState(Object.assign(this.state, {contacts: ContactStore.getContacts()}))
	}
	render () {
		const contacts = this.state.contacts.map(contact => {
			return <li key={contact.id}>
							  <Link to={`/contact/${contact.id}`}>{`${contact.first}  ${contact.last}`}</Link>
							</li>
		})
		return(
			<div className='app'>
				<nav>
					<Link to='/contact/new' >新建联系人</Link>
					<ul>
						{contacts}
					</ul>
				</nav>
				{this.props.children}
			</div>
		)
	}
}

class Index extends Component {
	render () {
		return(
			<div className='contact_body'>当还没有点击某个路由时显示的页面</div>
		)
	}
}

// const NewContact = React.createClass({
// 	createContact(event) {
//     event.preventDefault()

//     ContactStore.addContact({
//       first: findDOMNode(this.refs.first).value,
//       last: findDOMNode(this.refs.last).value
//     }, (contact) => {
//       this.props.router.push(`/contact/${contact.id}`)
//     })
//   },

//   render() {
//     return (
//       <form onSubmit={this.createContact}>
//         <p>
//           <input type="text" ref="first" placeholder="First name" />
//           <input type="text" ref="last" placeholder="Last name" />
//         </p>
//         <p>
//           <button type="submit">Save</button> <Link to="/">Cancel</Link>
//         </p>
//       </form>
//     )
//   }
// })

class NewContact extends Component {

	constructor(props){
		super(props)
		this.state = {
			first: '',
			last: ''
		}
	}

	createNewContact (event) {
		event.preventDefault()
		ContactStore.addContact(this.state, contact => this.context.router.push(`/contact/${contact.id}`))
	}
	_onChange (event) {
		event.preventDefault()
		const target = event.target
		const state = Object.assign({}, this.state, {[target.name]: target.value})

		this.setState(state)
	}
	render () {
		return (
			<form >
				<div>
					<input name = 'first' type='text' 
					value={this.state.first} 
					placeholder='first name' 
					onChange={this._onChange.bind(this)}/>
					<input name='last' type='text' 
					value={this.state.last} 
					placeholder='last name' 
					onChange={this._onChange.bind(this)}/>
				</div>
				<button onClick={this.createNewContact.bind(this)}>保存联系人</button>
				<Link to='/'>取消</Link>
			</form>
		)
	}
}
NewContact.contextTypes = {router: React.PropTypes.object}
class Contact extends Component {
	constructor(props){
		super(props)
		this.state = this.getContactFromStore()
	}
	getContactFromStore (props = this.props.params){
		const { id } = props 
		return {
			contact: ContactStore.getContact(id),
			isMounted: true
		}
	}
	componentDidMount () {
		ContactStore.addListener(this.updateContact.bind(this))
	}
	componentWillUnmount () {
		ContactStore.removeListener(this.updateContact.bind(this))
		this.state.isMounted = false
	}
	componentWillReceiveProps (nextProps){
		this.setState(this.getContactFromStore(nextProps.routeParams))
	}
	updateContact(){
		if(!this.state.isMounted) {
			return
		}
		this.setState(this.getContactFromStore())
	}
	destory () {
		const { id } = this.props.params
		ContactStore.removeContact(id)
		browserHistory.push('/')
	}
	render () {
		const contact = this.state.contact
		return(
			<div className='contact_body'>
				<div key={contact.id}>{`name: ${contact.first}  ${contact.last}`}</div>
				<button onClick={this.destory.bind(this)}>删除联系人</button>
			</div>
		)
	}
}

class NotFound extends Component {
	render () {
		return (
			<div className='not_found'>Sorry not found your page!</div>
		)
	}
}

render(
	(<Router history={browserHistory}>
		<Route path='/' component={App}>
			<IndexRoute component={Index}/>
			<Route path='contact/new' component={NewContact}/>
			<Route path='contact/:id' component={Contact} />
			<Route path='*' component={NotFound} />
		</Route>
	</Router>), document.querySelector('#container')
)