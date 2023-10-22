import { Badge, Box, Button, FormControl, FormErrorMessage, FormLabel, Icon, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Table, TableCaption, TableContainer, Tbody, Td, Textarea, Tfoot, Th, Thead, Tr, useDisclosure } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { RiDeleteBin7Fill, RiEdit2Fill } from "react-icons/ri";
import { useDispatch, useSelector } from 'react-redux';
import { appAxios } from '../axios/appAxios';
import { addTodo, setTodos } from '../features/todoSlice';

export default function TodoList() {

    const todos = useSelector((state) => state.todos.items);
    const dispatch = useDispatch();

    const getTodos = async () => {
        try {
            const result = await appAxios.get('/api/todos')
            dispatch(setTodos(result.data))
        } catch (error) {
            
        }
    }

    const getTodosByStatus = async (status) => {
        try {
            const result = await appAxios.get(`/api/todos/status/${status}`)
            dispatch(setTodos(result.data))
        } catch (error) {
            
        }
    }

    useEffect(() => {
        getTodos()
    }, [])


    const handleFilter = async(e) => {
        const value = e.target.value;
        console.log(value)
        if(value == 'ALL'){
            await getTodos()
        }

        if(value == 'INCOMPLETE' || value == 'COMPLETED'){
            await getTodosByStatus(value)
        }
    }

  return (
    <Box maxW={'720px'} mx={'auto'}>
    <Box>
        <FormControl>
            <FormLabel>Filter By</FormLabel>
            <Select onChange={handleFilter}>
                <option value={'ALL'}>ALL</option>
                <option value={'INCOMPLETE'}>INCOMPLETE</option>
                <option value={'COMPLETED'}>COMPLETED</option>
            </Select>
        </FormControl>
    </Box>
    <TableContainer>
        <Table variant='simple'>
            <TableCaption>
                {
                    todos.length == 0 ? "No todos available" : "Todo list table with required actions"
                }
            </TableCaption>
            <Thead>
            <Tr>
                <Th>Title</Th>
                <Th>Description</Th>
                <Th>Status</Th>
                <Th isNumeric>Action</Th>
            </Tr>
            </Thead>
            <Tbody>
            {
                todos.map((todo, index) =>(
                    <Tr key={index}>
                        <Td>{todo?.title}</Td>
                        <Td>{todo?.description}</Td>
                        <Td>
                         {
                            todo?.status == "COMPLETED" && <Badge colorScheme='green'>{todo?.status}</Badge>
                         }
                         {
                            todo?.status == "INCOMPLETE" && <Badge colorScheme='red'>{todo?.status}</Badge>
                         }
                        </Td>
                        <Td isNumeric>
                            <Box display={'flex'} gap={'16px'} justifyContent={'flex-end'}>                                
                                <Edit todo={todo}/>
                                <Delete todo={todo}/>
                            </Box>
                        </Td>
                    </Tr>
                ))
            }
        
            </Tbody>
       
        </Table>        
    </TableContainer>
    </Box>
  )
}

// Edit Component
function Edit({todo}) {
    const [title, setTitle] = useState(todo.title)
    const [description, setDescription] = useState(todo.description)
    const [status, setStatus] = useState(todo.status)

    const [isTitleInvalid, setIsTitleInvalid] = useState(false);
    const [isDescriptionInvalid, setIsDescriptonInvalid] = useState(false);

    const { isOpen, onOpen, onClose } = useDisclosure()
  
    const dispatch = useDispatch();

    const getTodos = async () => {
        try {
            const result = await appAxios.get('/api/todos')
            dispatch(setTodos(result.data))
        } catch (error) {
            
        }
    }

    const handleUpdate = async() => {
        // e.preventDefault()
        if(title.trim() == '') return setIsTitleInvalid(true)
        setIsTitleInvalid(false);
        if(description.trim() == '') return setIsDescriptonInvalid(true)
        setIsDescriptonInvalid(false)

        if (title.trim() !== '' && description.trim() !== '') {

        const todoData = {
            title,
            description,
            status
        }

            try {
                const result = await appAxios.put(`/api/todos/${todo._id}`, todoData)
                await getTodos()
                
                console.log(result)
                onClose()
            } catch (error) {
                console.log(error)
            }
        }
    }

    return (
      <>
        <IconButton onClick={onOpen} colorScheme='yellow' icon={<Icon as={RiEdit2Fill}/>}/>
        <Modal
          isOpen={isOpen}
          onClose={onClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Update Todo</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>              
                <FormControl>
                    <FormLabel>Title</FormLabel>
                    <Input onChange={(e) => setTitle(e.target.value)} value={title} required/>
                    {isTitleInvalid && <FormErrorMessage>Title is required.</FormErrorMessage>}
                </FormControl>
    
                <FormControl mt={4}>
                    <FormLabel>Description</FormLabel>
                    <Textarea onChange={(e) => setDescription(e.target.value)} value={description} required/>
                    {isDescriptionInvalid && <FormErrorMessage>Description is required.</FormErrorMessage>}
                </FormControl>

                <FormControl mt={4}>
                    <FormLabel>Status</FormLabel>
                    <Select onChange={(e) => setStatus(e.target.value)}>
                        <option selected={status == 'INCOMPLETE'} value={'INCOMPLETE'}>INCOMPLETE</option>
                        <option selected={status == 'COMPLETED'} value={'COMPLETED'}>COMPLETED</option>
                    </Select>
                </FormControl>
              
            </ModalBody>
  
            <ModalFooter>
              <Button onClick={handleUpdate} type='submit' colorScheme='blue' mr={3}>
                Save
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
       
      </>
    )
}

// Delete Component
function Delete({todo}) {

    const { isOpen, onOpen, onClose } = useDisclosure()

    const dispatch = useDispatch();

    const getTodos = async () => {
        try {
            const result = await appAxios.get('/api/todos')
            dispatch(setTodos(result.data))
        } catch (error) {
            
        }
    }

    const handleDelete = async() => {
        try {
            const result = await appAxios.delete(`/api/todos/${todo._id}`)
            await getTodos()
            
            console.log(result)
            onClose()
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>
        <IconButton onClick={onOpen} colorScheme='red' icon={<Icon as={RiDeleteBin7Fill}/>}/>
        <Modal
            isCentered
            onClose={onClose}
            isOpen={isOpen}
            motionPreset='slideInBottom'
        >
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>Do you want to delete?</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                
            </ModalBody>
            <ModalFooter>
                <Button mr={3} onClick={onClose}>
                Close
                </Button>
                <Button onClick={handleDelete} colorScheme='red'>Delete</Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
        </>
    )
    }
