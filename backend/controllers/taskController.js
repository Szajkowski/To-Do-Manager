const Task = require('../models/taskModel')
const mongoose = require('mongoose')

// zgarnij je wszystkie
const getTasks = async (req, res) => {
  const user_id = req.user._id

  const tasks = await Task.find({user_id}).sort({createdAt: -1})

  res.status(200).json(tasks)
}

// dupnij se zadanko byq
const getTask = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'Nie ma takiego zadania'})
  }

  const task = await Task.findById(id)

  if (!task) {
    return res.status(404).json({error: 'Nie ma takiego zadania'})
  }
  
  res.status(200).json(task)
}


// tworzenie zadania
const createTask = async (req, res) => {
  const {title, deadline, desc} = req.body

  let emptyFields = []

  // walidatione
  if(!title) {
    emptyFields.push('nazwa')
  }
  if(!desc) {
    emptyFields.push('opis')
  }
  if(!deadline) {
    emptyFields.push('termin')
  }
  if(emptyFields.length > 0) {
    return res.status(400).json({ error: 'Uzupełnij podane pola: ', emptyFields })
  }

  // dodawanko
  try {
    const user_id = req.user._id
    const task = await Task.create({title, deadline, desc, user_id})
    res.status(200).json(task)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

// usuwanko
const deleteTask = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'Nie ma takiego zadania'})
  }

  const task = await Task.findOneAndDelete({_id: id})

  if (!task) {
    return res.status(400).json({error: 'Nie ma takiego zadania'})
  }

  res.status(200).json(task)
}

// aktualizowanko
const updateTask = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'Nie ma takiego zadania'})
  }

  const task = await Task.findOneAndUpdate({_id: id}, {
    // wyluskanie parametrow z obiektu i zrobienie update'a tego co trzeba
    ...req.body
  })

  if (!task) {
    return res.status(400).json({error: 'Nie ma takiego zadania'})
  }

  res.status(200).json(task)
}


module.exports = {
  getTasks,
  getTask,
  createTask,
  deleteTask,
  updateTask
}