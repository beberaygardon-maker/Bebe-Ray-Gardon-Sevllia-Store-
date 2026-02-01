import React, { useState, useEffect } from 'react';
import { Button, Card, Input } from '@/components/ui';
import { ShoppingCart, Search } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import moment from 'moment';

const BebeRayGardonSevillaStore = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: products, isLoading, isError } = useQuery('products', async () => {
    const response = await base44.get('/products');
    return response.data;
  });

  const { mutate: addToCart } = useMutation(async (productId) => {
    await base44.post('/cart', { productId });
    queryClient.invalidateQueries('cart');
  });

  const handleSearch = () => {
    // Implement search functionality here
  };

  if (isLoading) {
    return <div className="text-center">Loading products...</div>;
  }

  if (isError) {
    return <div className="text-red-500 text-center">Error loading products</div>;
  }

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Bebe Ray Gardon Sevilla Store</h1>
      <div className="flex justify-center mb-4">
        <Input
          placeholder="Search for products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mr-2"
        />
        <Button onClick={handleSearch}>
          <Search size={20} />
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase())).map(product => (
          <Card key={product.id} className="p-4">
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover mb-2" />
            <h2 className="font-semibold">{product.name}</h2>
            <p className="text-gray-700">Price: ${product.price}</p>
            <p className="text-gray-500">{moment(product.updatedAt).format('MMM Do YYYY')}</p>
            <Button onClick={() => addToCart(product.id)} className="flex items-center mt-2">
              <ShoppingCart size={20} className="mr-2" />
              Add to Cart
            </Button>
          </Card>
        ))}
      </div>
      <footer className="mt-8">
        <Link to={createPageUrl('/cart')} className="text-blue-500">View Cart</Link>
      </footer>
    </div>
  );
};

export default BebeRayGardonSevillaStore;
