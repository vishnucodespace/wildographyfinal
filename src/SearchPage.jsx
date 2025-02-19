import React from 'react';
import HomeGrid from './HomeGrid';

const SearchPage = ({ searchItem }) => {
  return (
    <div>
      <HomeGrid searchItem={searchItem} />
    </div>
  );
};

export default SearchPage;
