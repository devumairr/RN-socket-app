import React from 'react';
import { View, StyleSheet, Image } from 'react-native';

const ImageCard = ({ source }: { source: string }) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: source }} style={styles.image} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '120%',
    height: 360,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    margin: 3,
  },
  imageContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#000',
    borderColor: '#fff',
    borderWidth: 2,
    borderRadius: 5,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'contain',
    borderRadius: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
});

export default ImageCard;
