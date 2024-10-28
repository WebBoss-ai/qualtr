import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Button } from './ui/button';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/jobSlice';

const category = [
    "SEO",
    "PPC",
    "Email Marketing",
    "SMM",
    "Content Marketing"
]

const CategoryCarousel = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const searchJobHandler = (query) => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    return (
        <div className='px-4'>
            <Carousel className="w-full max-w-xl mx-auto my-10 lg:my-20">
                <CarouselContent>
                    {category.map((cat, index) => (
                        <CarouselItem key={index} className="basis-1/2 md:basis-1/3 lg:basis-1/4 p-2">
                            <Button onClick={() => searchJobHandler(cat)} variant="outline" className="rounded-full w-full">
                                {cat}
                            </Button>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                
            </Carousel>
        </div>
    )
}

export default CategoryCarousel;
