import React, { useRef } from 'react';
import Carousel from 'react-native-snap-carousel';

import ImageCard from './ImageCard';

const ImageCarousel = ({ assets }: { assets: string[] }) => {
  const carouselRef = useRef<Carousel<any> | null>(null);

  return (
    <Carousel
      ref={ref => {
        carouselRef.current = ref;
      }}
      data={assets}
      //   loop={true}
      layout={'tinder'}
      layoutCardOffset={25}
      renderItem={({ item: url }) => {
        return <ImageCard source={url} />;
      }}
      sliderWidth={180}
      itemWidth={180}
    />
  );
};

export default ImageCarousel;
