import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function ActionAreaCard() {

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get('/allcategory').then((response) => {
      setCategories(response.data);
    });
  }, []);

  return (
    <div className="flex justify-center items-center">
      <div className="">
        <h2 className="text-center text-3xl mb-2 ">Popular Themes</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 mt-2 gap-x-6 gap-4">
          {categories.length > 0 &&
            categories.map((category) => (
              <Link to={'/category/' + category.title}>
                <Card sx={{ maxWidth: 200 }} key={category._id}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="100"
                      img
                      className="object-cover aspect-square rounded-2xl"
                      src={"http://www.letsgo.uno/uploads/" + category.photos[0]}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {category.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" className='truncate'>
                        {category.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Link>
            ))}
        </div>
      </div>
    </div>
  )
}
