import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Textarea,
  FormErrorMessage,
} from '@chakra-ui/react'
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTodo } from '../features/todoSlice';
import { appAxios } from '../axios/appAxios';

export default function SimpleCard() {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const [isTitleInvalid, setIsTitleInvalid] = useState(false);
    const [isDescriptionInvalid, setIsDescriptonInvalid] = useState(false);

    const dispatch = useDispatch();

    const handleAddTodo = async(e) => {
        e.preventDefault();

        if(title.trim() == '') return setIsTitleInvalid(true)
        setIsTitleInvalid(false);
        if(description.trim() == '') return setIsDescriptonInvalid(true)
        setIsDescriptonInvalid(false)

        if (title.trim() !== '' && description.trim() !== '') {

        const todoData = {
            title,
            description,
            status: "INCOMPLETE"
        }

            try {
                const result = await appAxios.post('/api/todos', todoData)
                dispatch(addTodo(result.data));
                
                console.log(result)

                setTitle('');
                setDescription('');
            } catch (error) {
                console.log(error)
            }
        }

};

  return (
    <form onSubmit={handleAddTodo}>
        <Flex
        minH={''}
        minW={'560px'}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}>
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
            <Stack align={'center'}>
            <Heading fontSize={'2xl'}>Create New Todo</Heading>
            
            </Stack>
            <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={8}>
            <Stack spacing={4}>

                <FormControl isInvalid={isTitleInvalid} id="title">
                    <FormLabel>Title</FormLabel>
                    <Input onChange={(e) => setTitle(e.target.value)} name='title' type="text" value={title} />
                    {isTitleInvalid && <FormErrorMessage>Title is required.</FormErrorMessage>}
                </FormControl>

                <FormControl isInvalid={isDescriptionInvalid} id="description">
                    <FormLabel>Description</FormLabel>
                    <Textarea onChange={(e) => setDescription(e.target.value)} name='description' type="text" value={description} />
                    {isDescriptionInvalid && <FormErrorMessage>Description is required.</FormErrorMessage>}
                </FormControl>

                <Button
                    type='submit'
                    bg={'blue.400'}
                    color={'white'}
                    _hover={{
                    bg: 'blue.500',
                    }}>
                    Create
                </Button>

            </Stack>
            </Box>
        </Stack>
        </Flex>
    </form>
  )
}