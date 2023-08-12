import React from 'react';
import './CatCard.scss';

function CatCard({ item }) {
  return (
    <div className='catCard'>
      <img src={item.img} alt={item.title} />
      <div className='card-content'>
        <h3 className='title'>{item.title}</h3>
        <p className='desc'>{item.desc}</p>
      </div>
    </div>
  );
}

export default CatCard;
