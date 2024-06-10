import React, { useEffect, useState } from 'react';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { exerciseOptions, fetchData } from '../utils/fetchData';
import HorizontalScrollbar from './HorizontalScrollbar';

const SearchExercises = ({ setExercises, bodyPart, setBodyPart }) => {
  const [search, setSearch] = useState('');
  const [bodyParts, setBodyParts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExercisesData = async () => {
      try {
        const bodyPartsData = await fetchData(
          'https://exercisedb.p.rapidapi.com/exercises/bodyPartList',
          exerciseOptions
        );
        console.log('Fetched body parts data:', bodyPartsData);

        if (Array.isArray(bodyPartsData)) {
          setBodyParts(['all', ...bodyPartsData]);
        } else {
          console.error('Expected bodyPartsData to be an array, but got:', bodyPartsData);
          setError('Failed to fetch body parts. Please try again later.');
          setBodyParts(['all']);
        }
      } catch (error) {
        console.error('Error fetching body parts data:', error);
        setError('Failed to fetch body parts. Please try again later.');
        setBodyParts(['all']);
      }
    };

    fetchExercisesData();
  }, []);

  const handleSearch = async () => {
    if (search) {
      try {
        const exerciseData = await fetchData(
          'https://exercisedb.p.rapidapi.com/exercises',
          exerciseOptions
        );
        console.log('Fetched exercise data:', exerciseData);

        const searchedExercises = exerciseData.filter(
          (e) =>
            e.name.toLowerCase().includes(search) ||
            e.target.toLowerCase().includes(search) ||
            e.equipment.toLowerCase().includes(search) ||
            e.bodyPart.toLowerCase().includes(search)
        );
        window.scrollTo({ top: 1800, left: 100, behavior: 'smooth' });
        setSearch('');
        setExercises(searchedExercises);
      } catch (error) {
        console.error('Error fetching exercises data:', error);
        setError('Failed to fetch exercises. Please try again later.');
      }
    }
  };

  return (
    <Stack alignItems="center" mt="37px" justifyContent="center" p="20px">
      <Typography
        fontWeight={700}
        sx={{
          fontSize: { lg: '44px', xs: '30px' }
        }}
        mb="50px"
        textAlign="center"
      >
        Awesome Exercises You <br />
        Should Know
      </Typography>
      <Box position="relative" mb="72px">
        <TextField
          sx={{
            input: {
              fontWeight: '700',
              border: 'none',
              borderRadius: '4px'
            },
            width: { lg: '1170px', xs: '350px' },
            backgroundColor: '#fff',
            borderRadius: '40px'
          }}
          height="76px"
          value={search}
          onChange={(e) => setSearch(e.target.value.toLowerCase())}
          placeholder="Search Exercises"
          type="text"
        />
        <Button
          className="search-btn"
          sx={{
            bgcolor: '#FF2625',
            color: '#fff',
            textTransform: 'none',
            width: { lg: '173px', xs: '80px' },
            fontSize: { lg: '20px', xs: '14px' },
            height: '56px',
            position: 'absolute',
            right: '0'
          }}
          onClick={handleSearch}
        >
          Search
        </Button>
      </Box>
      {error && (
        <Typography color="error" mb="20px">
          {error}
        </Typography>
      )}
      <Box sx={{ position: 'relative', width: '100%', p: '20px' }}>
        <HorizontalScrollbar
          data={bodyParts}
          bodyPart={bodyPart}
          setBodyPart={setBodyPart}
          isBodyParts
        />
      </Box>
    </Stack>
  );
};

export default SearchExercises;
