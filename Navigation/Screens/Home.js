import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, ImageBackground, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import PostCard from './Components/PostCard.js';
import CategoryCard from './Components/CategoryCard';
import faker from 'faker';



export default function Home({navigation}) {
  //posts for home screen
    const HomeScreenPosts = [
      {
        id:1,
        title: faker.address.streetAddress(),
        price: "50",
        currency: "BTC",
        location: "New York, NY",
        details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut imperdiet ut nisl ac venenatis. Pellentesque bibendum lectus risus. Etiam et tristique dolor. Sed et purus at lectus semper ullamcorper in non est. Curabitur venenatis nunc sit amet tortor venenatis commodo. Donec eu malesuada urna. Duis vulputate semper luctus. Nam aliquam est sit amet leo malesuada, id sodales sapien dapibus. Sed ornare ante vel metus placerat ornare. Pellentesque non risus venenatis, porttitor tellus sit amet, fringilla sem. Nam vitae elit vitae ex tincidunt pretium. ",
        description: "In nec gravida ex. Aliquam ultricies diam aliquam consectetur eleifend. Donec massa odio, sagittis sit amet finibus ac, suscipit lacinia metus. Sed nulla nulla, placerat eu volutpat at, pretium sed nulla. Ut dignissim enim in enim dapibus, in sollicitudin nulla sagittis. Curabitur nec turpis sed massa consequat gravida iaculis in orci. Ut tincidunt hendrerit nunc, a finibus urna vulputate vel. Quisque luctus mauris sed laoreet venenatis. Nunc convallis eleifend leo, quis sollicitudin leo condimentum in. Suspendisse accumsan erat nulla, quis venenatis lectus aliquam ut. Maecenas tempor nulla vel consectetur efficitur.",
        pic: 'https://images.pexels.com/photos/5998120/pexels-photo-5998120.jpeg?auto=compress&cs=tinysrgb&w=300'
      },
      {
        id:2,
        title: faker.address.streetAddress(),
        price: "50",
        currency: "BTC",
        location: "New York, NY",
        details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut imperdiet ut nisl ac venenatis. Pellentesque bibendum lectus risus. Etiam et tristique dolor. Sed et purus at lectus semper ullamcorper in non est. Curabitur venenatis nunc sit amet tortor venenatis commodo. Donec eu malesuada urna. Duis vulputate semper luctus. Nam aliquam est sit amet leo malesuada, id sodales sapien dapibus. Sed ornare ante vel metus placerat ornare. Pellentesque non risus venenatis, porttitor tellus sit amet, fringilla sem. Nam vitae elit vitae ex tincidunt pretium. ",
        description: "In nec gravida ex. Aliquam ultricies diam aliquam consectetur eleifend. Donec massa odio, sagittis sit amet finibus ac, suscipit lacinia metus. Sed nulla nulla, placerat eu volutpat at, pretium sed nulla. Ut dignissim enim in enim dapibus, in sollicitudin nulla sagittis. Curabitur nec turpis sed massa consequat gravida iaculis in orci. Ut tincidunt hendrerit nunc, a finibus urna vulputate vel. Quisque luctus mauris sed laoreet venenatis. Nunc convallis eleifend leo, quis sollicitudin leo condimentum in. Suspendisse accumsan erat nulla, quis venenatis lectus aliquam ut. Maecenas tempor nulla vel consectetur efficitur.",
        pic: 'https://nypost.com/wp-content/uploads/sites/2/2020/08/hamptons-housing-04.jpg?quality=75&strip=all&w=744'
      },
      {
        id:3,
        title: faker.address.streetAddress(),
        price: "50",
        currency: "ETH",
        location: "New York, NY",
        details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut imperdiet ut nisl ac venenatis. Pellentesque bibendum lectus risus. Etiam et tristique dolor. Sed et purus at lectus semper ullamcorper in non est. Curabitur venenatis nunc sit amet tortor venenatis commodo. Donec eu malesuada urna. Duis vulputate semper luctus. Nam aliquam est sit amet leo malesuada, id sodales sapien dapibus. Sed ornare ante vel metus placerat ornare. Pellentesque non risus venenatis, porttitor tellus sit amet, fringilla sem. Nam vitae elit vitae ex tincidunt pretium. ",
        description: "In nec gravida ex. Aliquam ultricies diam aliquam consectetur eleifend. Donec massa odio, sagittis sit amet finibus ac, suscipit lacinia metus. Sed nulla nulla, placerat eu volutpat at, pretium sed nulla. Ut dignissim enim in enim dapibus, in sollicitudin nulla sagittis. Curabitur nec turpis sed massa consequat gravida iaculis in orci. Ut tincidunt hendrerit nunc, a finibus urna vulputate vel. Quisque luctus mauris sed laoreet venenatis. Nunc convallis eleifend leo, quis sollicitudin leo condimentum in. Suspendisse accumsan erat nulla, quis venenatis lectus aliquam ut. Maecenas tempor nulla vel consectetur efficitur.",
        pic: 'https://images.squarespace-cdn.com/content/v1/58487dc4b8a79b6d02499b60/1650194082470-72Q6R35RXYETS0ZBRBL0/Francis+York+Iconic+Oceanfront+Estate+for+Sale+in+the+Hamptons%2C+NY+1.jpeg?format=1500w'
      },
      {
        id:4,
        title: faker.address.streetAddress(),
        price: "10",
        currency: "DOGE",
        location: "New York, NY",
        details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut imperdiet ut nisl ac venenatis. Pellentesque bibendum lectus risus. Etiam et tristique dolor. Sed et purus at lectus semper ullamcorper in non est. Curabitur venenatis nunc sit amet tortor venenatis commodo. Donec eu malesuada urna. Duis vulputate semper luctus. Nam aliquam est sit amet leo malesuada, id sodales sapien dapibus. Sed ornare ante vel metus placerat ornare. Pellentesque non risus venenatis, porttitor tellus sit amet, fringilla sem. Nam vitae elit vitae ex tincidunt pretium. ",
        description: "In nec gravida ex. Aliquam ultricies diam aliquam consectetur eleifend. Donec massa odio, sagittis sit amet finibus ac, suscipit lacinia metus. Sed nulla nulla, placerat eu volutpat at, pretium sed nulla. Ut dignissim enim in enim dapibus, in sollicitudin nulla sagittis. Curabitur nec turpis sed massa consequat gravida iaculis in orci. Ut tincidunt hendrerit nunc, a finibus urna vulputate vel. Quisque luctus mauris sed laoreet venenatis. Nunc convallis eleifend leo, quis sollicitudin leo condimentum in. Suspendisse accumsan erat nulla, quis venenatis lectus aliquam ut. Maecenas tempor nulla vel consectetur efficitur.",
        pic: 'https://newyorkaktuell.nyc/app/uploads/2019/01/D9A0BCAF_91B8_7137_797B_501406CCD777_1050x700.0-1024x683.jpg'
      },
    ]
  //posts for Homes
    const HomePosts = [
        {
          id:1,
          title: faker.address.streetAddress(),
          price: "560",
          currency: "SOL",
          location: faker.address.state(),
          details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut imperdiet ut nisl ac venenatis. Pellentesque bibendum lectus risus. Etiam et tristique dolor. Sed et purus at lectus semper ullamcorper in non est. Curabitur venenatis nunc sit amet tortor venenatis commodo. Donec eu malesuada urna. Duis vulputate semper luctus. Nam aliquam est sit amet leo malesuada, id sodales sapien dapibus. Sed ornare ante vel metus placerat ornare. Pellentesque non risus venenatis, porttitor tellus sit amet, fringilla sem. Nam vitae elit vitae ex tincidunt pretium. ",
          description: "In nec gravida ex. Aliquam ultricies diam aliquam consectetur eleifend. Donec massa odio, sagittis sit amet finibus ac, suscipit lacinia metus. Sed nulla nulla, placerat eu volutpat at, pretium sed nulla. Ut dignissim enim in enim dapibus, in sollicitudin nulla sagittis. Curabitur nec turpis sed massa consequat gravida iaculis in orci. Ut tincidunt hendrerit nunc, a finibus urna vulputate vel. Quisque luctus mauris sed laoreet venenatis. Nunc convallis eleifend leo, quis sollicitudin leo condimentum in. Suspendisse accumsan erat nulla, quis venenatis lectus aliquam ut. Maecenas tempor nulla vel consectetur efficitur.",
          pic: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=300'
        },
        {
          id:2,
          title: faker.address.streetAddress(),
          price: "50",
          currency: "BTC",
          location:faker.address.state(),
          details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut imperdiet ut nisl ac venenatis. Pellentesque bibendum lectus risus. Etiam et tristique dolor. Sed et purus at lectus semper ullamcorper in non est. Curabitur venenatis nunc sit amet tortor venenatis commodo. Donec eu malesuada urna. Duis vulputate semper luctus. Nam aliquam est sit amet leo malesuada, id sodales sapien dapibus. Sed ornare ante vel metus placerat ornare. Pellentesque non risus venenatis, porttitor tellus sit amet, fringilla sem. Nam vitae elit vitae ex tincidunt pretium. ",
          description: "In nec gravida ex. Aliquam ultricies diam aliquam consectetur eleifend. Donec massa odio, sagittis sit amet finibus ac, suscipit lacinia metus. Sed nulla nulla, placerat eu volutpat at, pretium sed nulla. Ut dignissim enim in enim dapibus, in sollicitudin nulla sagittis. Curabitur nec turpis sed massa consequat gravida iaculis in orci. Ut tincidunt hendrerit nunc, a finibus urna vulputate vel. Quisque luctus mauris sed laoreet venenatis. Nunc convallis eleifend leo, quis sollicitudin leo condimentum in. Suspendisse accumsan erat nulla, quis venenatis lectus aliquam ut. Maecenas tempor nulla vel consectetur efficitur.",
          pic: 'https://images.pexels.com/photos/8134820/pexels-photo-8134820.jpeg?auto=compress&cs=tinysrgb&w=300'
        },
        {
          id:3,
          title: faker.address.streetAddress(),
          price: "50",
          currency: "ETH",
          location: faker.address.state(),
          details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut imperdiet ut nisl ac venenatis. Pellentesque bibendum lectus risus. Etiam et tristique dolor. Sed et purus at lectus semper ullamcorper in non est. Curabitur venenatis nunc sit amet tortor venenatis commodo. Donec eu malesuada urna. Duis vulputate semper luctus. Nam aliquam est sit amet leo malesuada, id sodales sapien dapibus. Sed ornare ante vel metus placerat ornare. Pellentesque non risus venenatis, porttitor tellus sit amet, fringilla sem. Nam vitae elit vitae ex tincidunt pretium. ",
          description: "In nec gravida ex. Aliquam ultricies diam aliquam consectetur eleifend. Donec massa odio, sagittis sit amet finibus ac, suscipit lacinia metus. Sed nulla nulla, placerat eu volutpat at, pretium sed nulla. Ut dignissim enim in enim dapibus, in sollicitudin nulla sagittis. Curabitur nec turpis sed massa consequat gravida iaculis in orci. Ut tincidunt hendrerit nunc, a finibus urna vulputate vel. Quisque luctus mauris sed laoreet venenatis. Nunc convallis eleifend leo, quis sollicitudin leo condimentum in. Suspendisse accumsan erat nulla, quis venenatis lectus aliquam ut. Maecenas tempor nulla vel consectetur efficitur.",
          pic: 'https://images.pexels.com/photos/7598365/pexels-photo-7598365.jpeg?auto=compress&cs=tinysrgb&w=300'
        },
        {
          id:4,
          title: faker.address.streetAddress(),
          price: "10",
          currency: "DOGE",
          location: faker.address.state(),
          details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut imperdiet ut nisl ac venenatis. Pellentesque bibendum lectus risus. Etiam et tristique dolor. Sed et purus at lectus semper ullamcorper in non est. Curabitur venenatis nunc sit amet tortor venenatis commodo. Donec eu malesuada urna. Duis vulputate semper luctus. Nam aliquam est sit amet leo malesuada, id sodales sapien dapibus. Sed ornare ante vel metus placerat ornare. Pellentesque non risus venenatis, porttitor tellus sit amet, fringilla sem. Nam vitae elit vitae ex tincidunt pretium. ",
          description: "In nec gravida ex. Aliquam ultricies diam aliquam consectetur eleifend. Donec massa odio, sagittis sit amet finibus ac, suscipit lacinia metus. Sed nulla nulla, placerat eu volutpat at, pretium sed nulla. Ut dignissim enim in enim dapibus, in sollicitudin nulla sagittis. Curabitur nec turpis sed massa consequat gravida iaculis in orci. Ut tincidunt hendrerit nunc, a finibus urna vulputate vel. Quisque luctus mauris sed laoreet venenatis. Nunc convallis eleifend leo, quis sollicitudin leo condimentum in. Suspendisse accumsan erat nulla, quis venenatis lectus aliquam ut. Maecenas tempor nulla vel consectetur efficitur.",
          pic: 'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=300',
        },
    ]
    //posts for automobiles
    const CarPosts = [
      {
        id:1,
        title: 'Lamborgini huracan',
        price: "560",
        currency: "SOL",
        location: "New York, NY",
        details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut imperdiet ut nisl ac venenatis. Pellentesque bibendum lectus risus. Etiam et tristique dolor. Sed et purus at lectus semper ullamcorper in non est. Curabitur venenatis nunc sit amet tortor venenatis commodo. Donec eu malesuada urna. Duis vulputate semper luctus. Nam aliquam est sit amet leo malesuada, id sodales sapien dapibus. Sed ornare ante vel metus placerat ornare. Pellentesque non risus venenatis, porttitor tellus sit amet, fringilla sem. Nam vitae elit vitae ex tincidunt pretium. ",
        description: "In nec gravida ex. Aliquam ultricies diam aliquam consectetur eleifend. Donec massa odio, sagittis sit amet finibus ac, suscipit lacinia metus. Sed nulla nulla, placerat eu volutpat at, pretium sed nulla. Ut dignissim enim in enim dapibus, in sollicitudin nulla sagittis. Curabitur nec turpis sed massa consequat gravida iaculis in orci. Ut tincidunt hendrerit nunc, a finibus urna vulputate vel. Quisque luctus mauris sed laoreet venenatis. Nunc convallis eleifend leo, quis sollicitudin leo condimentum in. Suspendisse accumsan erat nulla, quis venenatis lectus aliquam ut. Maecenas tempor nulla vel consectetur efficitur.",
        pic: 'https://images.pexels.com/photos/5063626/pexels-photo-5063626.jpeg?auto=compress&cs=tinysrgb&w=300'
      },
      {
        id:2,
        title: 'Lamborgini aventador',
        price: "50",
        currency: "BTC",
        location: "New York, NY",
        details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut imperdiet ut nisl ac venenatis. Pellentesque bibendum lectus risus. Etiam et tristique dolor. Sed et purus at lectus semper ullamcorper in non est. Curabitur venenatis nunc sit amet tortor venenatis commodo. Donec eu malesuada urna. Duis vulputate semper luctus. Nam aliquam est sit amet leo malesuada, id sodales sapien dapibus. Sed ornare ante vel metus placerat ornare. Pellentesque non risus venenatis, porttitor tellus sit amet, fringilla sem. Nam vitae elit vitae ex tincidunt pretium. ",
        description: "In nec gravida ex. Aliquam ultricies diam aliquam consectetur eleifend. Donec massa odio, sagittis sit amet finibus ac, suscipit lacinia metus. Sed nulla nulla, placerat eu volutpat at, pretium sed nulla. Ut dignissim enim in enim dapibus, in sollicitudin nulla sagittis. Curabitur nec turpis sed massa consequat gravida iaculis in orci. Ut tincidunt hendrerit nunc, a finibus urna vulputate vel. Quisque luctus mauris sed laoreet venenatis. Nunc convallis eleifend leo, quis sollicitudin leo condimentum in. Suspendisse accumsan erat nulla, quis venenatis lectus aliquam ut. Maecenas tempor nulla vel consectetur efficitur.",
        pic: 'https://images.pexels.com/photos/5058348/pexels-photo-5058348.jpeg?auto=compress&cs=tinysrgb&w=300'
      },
      {
        id:3,
        title: 'Mclaren 720s',
        price: "50",
        currency: "ETH",
        location: "New York, NY",
        details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut imperdiet ut nisl ac venenatis. Pellentesque bibendum lectus risus. Etiam et tristique dolor. Sed et purus at lectus semper ullamcorper in non est. Curabitur venenatis nunc sit amet tortor venenatis commodo. Donec eu malesuada urna. Duis vulputate semper luctus. Nam aliquam est sit amet leo malesuada, id sodales sapien dapibus. Sed ornare ante vel metus placerat ornare. Pellentesque non risus venenatis, porttitor tellus sit amet, fringilla sem. Nam vitae elit vitae ex tincidunt pretium. ",
        description: "In nec gravida ex. Aliquam ultricies diam aliquam consectetur eleifend. Donec massa odio, sagittis sit amet finibus ac, suscipit lacinia metus. Sed nulla nulla, placerat eu volutpat at, pretium sed nulla. Ut dignissim enim in enim dapibus, in sollicitudin nulla sagittis. Curabitur nec turpis sed massa consequat gravida iaculis in orci. Ut tincidunt hendrerit nunc, a finibus urna vulputate vel. Quisque luctus mauris sed laoreet venenatis. Nunc convallis eleifend leo, quis sollicitudin leo condimentum in. Suspendisse accumsan erat nulla, quis venenatis lectus aliquam ut. Maecenas tempor nulla vel consectetur efficitur.",
        pic: 'https://images.pexels.com/photos/8590608/pexels-photo-8590608.jpeg?auto=compress&cs=tinysrgb&w=300'
      },
      {
        id:4,
        title: 'porsche 911',
        price: "10",
        currency: "DOGE",
        location: "New York, NY",
        details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut imperdiet ut nisl ac venenatis. Pellentesque bibendum lectus risus. Etiam et tristique dolor. Sed et purus at lectus semper ullamcorper in non est. Curabitur venenatis nunc sit amet tortor venenatis commodo. Donec eu malesuada urna. Duis vulputate semper luctus. Nam aliquam est sit amet leo malesuada, id sodales sapien dapibus. Sed ornare ante vel metus placerat ornare. Pellentesque non risus venenatis, porttitor tellus sit amet, fringilla sem. Nam vitae elit vitae ex tincidunt pretium. ",
        description: "In nec gravida ex. Aliquam ultricies diam aliquam consectetur eleifend. Donec massa odio, sagittis sit amet finibus ac, suscipit lacinia metus. Sed nulla nulla, placerat eu volutpat at, pretium sed nulla. Ut dignissim enim in enim dapibus, in sollicitudin nulla sagittis. Curabitur nec turpis sed massa consequat gravida iaculis in orci. Ut tincidunt hendrerit nunc, a finibus urna vulputate vel. Quisque luctus mauris sed laoreet venenatis. Nunc convallis eleifend leo, quis sollicitudin leo condimentum in. Suspendisse accumsan erat nulla, quis venenatis lectus aliquam ut. Maecenas tempor nulla vel consectetur efficitur.",
        pic: 'https://images.pexels.com/photos/12587782/pexels-photo-12587782.jpeg?auto=compress&cs=tinysrgb&w=300'
      },
    ]
    //posts for tech
    const TechPosts = [
      {
        id:1,
        title: "ipad Pro 11 inch",
        price: "560",
        currency: "SOL",
        location: "New York, NY",
        details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut imperdiet ut nisl ac venenatis. Pellentesque bibendum lectus risus. Etiam et tristique dolor. Sed et purus at lectus semper ullamcorper in non est. Curabitur venenatis nunc sit amet tortor venenatis commodo. Donec eu malesuada urna. Duis vulputate semper luctus. Nam aliquam est sit amet leo malesuada, id sodales sapien dapibus. Sed ornare ante vel metus placerat ornare. Pellentesque non risus venenatis, porttitor tellus sit amet, fringilla sem. Nam vitae elit vitae ex tincidunt pretium. ",
        description: "In nec gravida ex. Aliquam ultricies diam aliquam consectetur eleifend. Donec massa odio, sagittis sit amet finibus ac, suscipit lacinia metus. Sed nulla nulla, placerat eu volutpat at, pretium sed nulla. Ut dignissim enim in enim dapibus, in sollicitudin nulla sagittis. Curabitur nec turpis sed massa consequat gravida iaculis in orci. Ut tincidunt hendrerit nunc, a finibus urna vulputate vel. Quisque luctus mauris sed laoreet venenatis. Nunc convallis eleifend leo, quis sollicitudin leo condimentum in. Suspendisse accumsan erat nulla, quis venenatis lectus aliquam ut. Maecenas tempor nulla vel consectetur efficitur.",
        pic: 'https://images.pexels.com/photos/3082341/pexels-photo-3082341.jpeg?auto=compress&cs=tinysrgb&w=300'
      },
      {
        id:2,
        title: 'm1 macbook pro',
        price: "50",
        currency: "BTC",
        location: "New York, NY",
        details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut imperdiet ut nisl ac venenatis. Pellentesque bibendum lectus risus. Etiam et tristique dolor. Sed et purus at lectus semper ullamcorper in non est. Curabitur venenatis nunc sit amet tortor venenatis commodo. Donec eu malesuada urna. Duis vulputate semper luctus. Nam aliquam est sit amet leo malesuada, id sodales sapien dapibus. Sed ornare ante vel metus placerat ornare. Pellentesque non risus venenatis, porttitor tellus sit amet, fringilla sem. Nam vitae elit vitae ex tincidunt pretium. ",
        description: "In nec gravida ex. Aliquam ultricies diam aliquam consectetur eleifend. Donec massa odio, sagittis sit amet finibus ac, suscipit lacinia metus. Sed nulla nulla, placerat eu volutpat at, pretium sed nulla. Ut dignissim enim in enim dapibus, in sollicitudin nulla sagittis. Curabitur nec turpis sed massa consequat gravida iaculis in orci. Ut tincidunt hendrerit nunc, a finibus urna vulputate vel. Quisque luctus mauris sed laoreet venenatis. Nunc convallis eleifend leo, quis sollicitudin leo condimentum in. Suspendisse accumsan erat nulla, quis venenatis lectus aliquam ut. Maecenas tempor nulla vel consectetur efficitur.",
        pic: 'https://images.pexels.com/photos/303383/pexels-photo-303383.jpeg?auto=compress&cs=tinysrgb&w=300'
      },
      {
        id:3,
        title: "windows computer",
        price: "50",
        currency: "ETH",
        location: "New York, NY",
        details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut imperdiet ut nisl ac venenatis. Pellentesque bibendum lectus risus. Etiam et tristique dolor. Sed et purus at lectus semper ullamcorper in non est. Curabitur venenatis nunc sit amet tortor venenatis commodo. Donec eu malesuada urna. Duis vulputate semper luctus. Nam aliquam est sit amet leo malesuada, id sodales sapien dapibus. Sed ornare ante vel metus placerat ornare. Pellentesque non risus venenatis, porttitor tellus sit amet, fringilla sem. Nam vitae elit vitae ex tincidunt pretium. ",
        description: "In nec gravida ex. Aliquam ultricies diam aliquam consectetur eleifend. Donec massa odio, sagittis sit amet finibus ac, suscipit lacinia metus. Sed nulla nulla, placerat eu volutpat at, pretium sed nulla. Ut dignissim enim in enim dapibus, in sollicitudin nulla sagittis. Curabitur nec turpis sed massa consequat gravida iaculis in orci. Ut tincidunt hendrerit nunc, a finibus urna vulputate vel. Quisque luctus mauris sed laoreet venenatis. Nunc convallis eleifend leo, quis sollicitudin leo condimentum in. Suspendisse accumsan erat nulla, quis venenatis lectus aliquam ut. Maecenas tempor nulla vel consectetur efficitur.",
        pic: 'https://images.pexels.com/photos/6372946/pexels-photo-6372946.jpeg?auto=compress&cs=tinysrgb&w=300'
      },
      {
        id:4,
        title: "Mac",
        price: "10",
        currency: "DOGE",
        location: "New York, NY",
        details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut imperdiet ut nisl ac venenatis. Pellentesque bibendum lectus risus. Etiam et tristique dolor. Sed et purus at lectus semper ullamcorper in non est. Curabitur venenatis nunc sit amet tortor venenatis commodo. Donec eu malesuada urna. Duis vulputate semper luctus. Nam aliquam est sit amet leo malesuada, id sodales sapien dapibus. Sed ornare ante vel metus placerat ornare. Pellentesque non risus venenatis, porttitor tellus sit amet, fringilla sem. Nam vitae elit vitae ex tincidunt pretium. ",
        description: "In nec gravida ex. Aliquam ultricies diam aliquam consectetur eleifend. Donec massa odio, sagittis sit amet finibus ac, suscipit lacinia metus. Sed nulla nulla, placerat eu volutpat at, pretium sed nulla. Ut dignissim enim in enim dapibus, in sollicitudin nulla sagittis. Curabitur nec turpis sed massa consequat gravida iaculis in orci. Ut tincidunt hendrerit nunc, a finibus urna vulputate vel. Quisque luctus mauris sed laoreet venenatis. Nunc convallis eleifend leo, quis sollicitudin leo condimentum in. Suspendisse accumsan erat nulla, quis venenatis lectus aliquam ut. Maecenas tempor nulla vel consectetur efficitur.",
        pic: 'https://images.pexels.com/photos/6476587/pexels-photo-6476587.jpeg?auto=compress&cs=tinysrgb&w=300'
      },
    ]
    //posts for bikes
    const BikePosts = [
      {
        id:1,
        title: "ipad Pro 11 inch",
        price: "560",
        currency: "SOL",
        location: "New York, NY",
        details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut imperdiet ut nisl ac venenatis. Pellentesque bibendum lectus risus. Etiam et tristique dolor. Sed et purus at lectus semper ullamcorper in non est. Curabitur venenatis nunc sit amet tortor venenatis commodo. Donec eu malesuada urna. Duis vulputate semper luctus. Nam aliquam est sit amet leo malesuada, id sodales sapien dapibus. Sed ornare ante vel metus placerat ornare. Pellentesque non risus venenatis, porttitor tellus sit amet, fringilla sem. Nam vitae elit vitae ex tincidunt pretium. ",
        description: "In nec gravida ex. Aliquam ultricies diam aliquam consectetur eleifend. Donec massa odio, sagittis sit amet finibus ac, suscipit lacinia metus. Sed nulla nulla, placerat eu volutpat at, pretium sed nulla. Ut dignissim enim in enim dapibus, in sollicitudin nulla sagittis. Curabitur nec turpis sed massa consequat gravida iaculis in orci. Ut tincidunt hendrerit nunc, a finibus urna vulputate vel. Quisque luctus mauris sed laoreet venenatis. Nunc convallis eleifend leo, quis sollicitudin leo condimentum in. Suspendisse accumsan erat nulla, quis venenatis lectus aliquam ut. Maecenas tempor nulla vel consectetur efficitur.",
        // pic: require('../PostImages/ipadPro.jpg')
      },
      {
        id:2,
        title: "2015 lamborgini aventedor",
        price: "50",
        currency: "BTC",
        location: "New York, NY",
        details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut imperdiet ut nisl ac venenatis. Pellentesque bibendum lectus risus. Etiam et tristique dolor. Sed et purus at lectus semper ullamcorper in non est. Curabitur venenatis nunc sit amet tortor venenatis commodo. Donec eu malesuada urna. Duis vulputate semper luctus. Nam aliquam est sit amet leo malesuada, id sodales sapien dapibus. Sed ornare ante vel metus placerat ornare. Pellentesque non risus venenatis, porttitor tellus sit amet, fringilla sem. Nam vitae elit vitae ex tincidunt pretium. ",
        description: "In nec gravida ex. Aliquam ultricies diam aliquam consectetur eleifend. Donec massa odio, sagittis sit amet finibus ac, suscipit lacinia metus. Sed nulla nulla, placerat eu volutpat at, pretium sed nulla. Ut dignissim enim in enim dapibus, in sollicitudin nulla sagittis. Curabitur nec turpis sed massa consequat gravida iaculis in orci. Ut tincidunt hendrerit nunc, a finibus urna vulputate vel. Quisque luctus mauris sed laoreet venenatis. Nunc convallis eleifend leo, quis sollicitudin leo condimentum in. Suspendisse accumsan erat nulla, quis venenatis lectus aliquam ut. Maecenas tempor nulla vel consectetur efficitur.",
        // pic: require('../PostImages/2015 Lamborghini Aventador.jpg')
      },
      {
        id:3,
        title: "2015 lamborgini Hurcan",
        price: "50",
        currency: "ETH",
        location: "New York, NY",
        details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut imperdiet ut nisl ac venenatis. Pellentesque bibendum lectus risus. Etiam et tristique dolor. Sed et purus at lectus semper ullamcorper in non est. Curabitur venenatis nunc sit amet tortor venenatis commodo. Donec eu malesuada urna. Duis vulputate semper luctus. Nam aliquam est sit amet leo malesuada, id sodales sapien dapibus. Sed ornare ante vel metus placerat ornare. Pellentesque non risus venenatis, porttitor tellus sit amet, fringilla sem. Nam vitae elit vitae ex tincidunt pretium. ",
        description: "In nec gravida ex. Aliquam ultricies diam aliquam consectetur eleifend. Donec massa odio, sagittis sit amet finibus ac, suscipit lacinia metus. Sed nulla nulla, placerat eu volutpat at, pretium sed nulla. Ut dignissim enim in enim dapibus, in sollicitudin nulla sagittis. Curabitur nec turpis sed massa consequat gravida iaculis in orci. Ut tincidunt hendrerit nunc, a finibus urna vulputate vel. Quisque luctus mauris sed laoreet venenatis. Nunc convallis eleifend leo, quis sollicitudin leo condimentum in. Suspendisse accumsan erat nulla, quis venenatis lectus aliquam ut. Maecenas tempor nulla vel consectetur efficitur.",
        // pic: require("../assets/2015 Lamborghini Aventador.jpg")
      },
      {
        id:4,
        title: "2012 ford f-150",
        price: "10",
        currency: "DOGE",
        location: "New York, NY",
        details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut imperdiet ut nisl ac venenatis. Pellentesque bibendum lectus risus. Etiam et tristique dolor. Sed et purus at lectus semper ullamcorper in non est. Curabitur venenatis nunc sit amet tortor venenatis commodo. Donec eu malesuada urna. Duis vulputate semper luctus. Nam aliquam est sit amet leo malesuada, id sodales sapien dapibus. Sed ornare ante vel metus placerat ornare. Pellentesque non risus venenatis, porttitor tellus sit amet, fringilla sem. Nam vitae elit vitae ex tincidunt pretium. ",
        description: "In nec gravida ex. Aliquam ultricies diam aliquam consectetur eleifend. Donec massa odio, sagittis sit amet finibus ac, suscipit lacinia metus. Sed nulla nulla, placerat eu volutpat at, pretium sed nulla. Ut dignissim enim in enim dapibus, in sollicitudin nulla sagittis. Curabitur nec turpis sed massa consequat gravida iaculis in orci. Ut tincidunt hendrerit nunc, a finibus urna vulputate vel. Quisque luctus mauris sed laoreet venenatis. Nunc convallis eleifend leo, quis sollicitudin leo condimentum in. Suspendisse accumsan erat nulla, quis venenatis lectus aliquam ut. Maecenas tempor nulla vel consectetur efficitur.",
        // pic: require("../assets/2015 Lamborghini Aventador.jpg")
      },
    ]
    //posts for appliences
    const AppliencePosts = [
      {
        id:1,
        title: "ipad Pro 11 inch",
        price: "560",
        currency: "SOL",
        location: "New York, NY",
        details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut imperdiet ut nisl ac venenatis. Pellentesque bibendum lectus risus. Etiam et tristique dolor. Sed et purus at lectus semper ullamcorper in non est. Curabitur venenatis nunc sit amet tortor venenatis commodo. Donec eu malesuada urna. Duis vulputate semper luctus. Nam aliquam est sit amet leo malesuada, id sodales sapien dapibus. Sed ornare ante vel metus placerat ornare. Pellentesque non risus venenatis, porttitor tellus sit amet, fringilla sem. Nam vitae elit vitae ex tincidunt pretium. ",
        description: "In nec gravida ex. Aliquam ultricies diam aliquam consectetur eleifend. Donec massa odio, sagittis sit amet finibus ac, suscipit lacinia metus. Sed nulla nulla, placerat eu volutpat at, pretium sed nulla. Ut dignissim enim in enim dapibus, in sollicitudin nulla sagittis. Curabitur nec turpis sed massa consequat gravida iaculis in orci. Ut tincidunt hendrerit nunc, a finibus urna vulputate vel. Quisque luctus mauris sed laoreet venenatis. Nunc convallis eleifend leo, quis sollicitudin leo condimentum in. Suspendisse accumsan erat nulla, quis venenatis lectus aliquam ut. Maecenas tempor nulla vel consectetur efficitur.",
        // pic: require('../PostImages/ipadPro.jpg')
      },
      {
        id:2,
        title: "2015 lamborgini aventedor",
        price: "50",
        currency: "BTC",
        location: "New York, NY",
        details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut imperdiet ut nisl ac venenatis. Pellentesque bibendum lectus risus. Etiam et tristique dolor. Sed et purus at lectus semper ullamcorper in non est. Curabitur venenatis nunc sit amet tortor venenatis commodo. Donec eu malesuada urna. Duis vulputate semper luctus. Nam aliquam est sit amet leo malesuada, id sodales sapien dapibus. Sed ornare ante vel metus placerat ornare. Pellentesque non risus venenatis, porttitor tellus sit amet, fringilla sem. Nam vitae elit vitae ex tincidunt pretium. ",
        description: "In nec gravida ex. Aliquam ultricies diam aliquam consectetur eleifend. Donec massa odio, sagittis sit amet finibus ac, suscipit lacinia metus. Sed nulla nulla, placerat eu volutpat at, pretium sed nulla. Ut dignissim enim in enim dapibus, in sollicitudin nulla sagittis. Curabitur nec turpis sed massa consequat gravida iaculis in orci. Ut tincidunt hendrerit nunc, a finibus urna vulputate vel. Quisque luctus mauris sed laoreet venenatis. Nunc convallis eleifend leo, quis sollicitudin leo condimentum in. Suspendisse accumsan erat nulla, quis venenatis lectus aliquam ut. Maecenas tempor nulla vel consectetur efficitur.",
        // pic: require('../PostImages/2015 Lamborghini Aventador.jpg')
      },
      {
        id:3,
        title: "2015 lamborgini Hurcan",
        price: "50",
        currency: "ETH",
        location: "New York, NY",
        details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut imperdiet ut nisl ac venenatis. Pellentesque bibendum lectus risus. Etiam et tristique dolor. Sed et purus at lectus semper ullamcorper in non est. Curabitur venenatis nunc sit amet tortor venenatis commodo. Donec eu malesuada urna. Duis vulputate semper luctus. Nam aliquam est sit amet leo malesuada, id sodales sapien dapibus. Sed ornare ante vel metus placerat ornare. Pellentesque non risus venenatis, porttitor tellus sit amet, fringilla sem. Nam vitae elit vitae ex tincidunt pretium. ",
        description: "In nec gravida ex. Aliquam ultricies diam aliquam consectetur eleifend. Donec massa odio, sagittis sit amet finibus ac, suscipit lacinia metus. Sed nulla nulla, placerat eu volutpat at, pretium sed nulla. Ut dignissim enim in enim dapibus, in sollicitudin nulla sagittis. Curabitur nec turpis sed massa consequat gravida iaculis in orci. Ut tincidunt hendrerit nunc, a finibus urna vulputate vel. Quisque luctus mauris sed laoreet venenatis. Nunc convallis eleifend leo, quis sollicitudin leo condimentum in. Suspendisse accumsan erat nulla, quis venenatis lectus aliquam ut. Maecenas tempor nulla vel consectetur efficitur.",
        // pic: require("../assets/2015 Lamborghini Aventador.jpg")
      },
      {
        id:4,
        title: "2012 ford f-150",
        price: "10",
        currency: "DOGE",
        location: "New York, NY",
        details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut imperdiet ut nisl ac venenatis. Pellentesque bibendum lectus risus. Etiam et tristique dolor. Sed et purus at lectus semper ullamcorper in non est. Curabitur venenatis nunc sit amet tortor venenatis commodo. Donec eu malesuada urna. Duis vulputate semper luctus. Nam aliquam est sit amet leo malesuada, id sodales sapien dapibus. Sed ornare ante vel metus placerat ornare. Pellentesque non risus venenatis, porttitor tellus sit amet, fringilla sem. Nam vitae elit vitae ex tincidunt pretium. ",
        description: "In nec gravida ex. Aliquam ultricies diam aliquam consectetur eleifend. Donec massa odio, sagittis sit amet finibus ac, suscipit lacinia metus. Sed nulla nulla, placerat eu volutpat at, pretium sed nulla. Ut dignissim enim in enim dapibus, in sollicitudin nulla sagittis. Curabitur nec turpis sed massa consequat gravida iaculis in orci. Ut tincidunt hendrerit nunc, a finibus urna vulputate vel. Quisque luctus mauris sed laoreet venenatis. Nunc convallis eleifend leo, quis sollicitudin leo condimentum in. Suspendisse accumsan erat nulla, quis venenatis lectus aliquam ut. Maecenas tempor nulla vel consectetur efficitur.",
        // pic: require("../assets/2015 Lamborghini Aventador.jpg")
      },
    ]
    return (
      <SafeAreaView style={{flex:1}}>
        <StatusBar style="auto" />
        <ScrollView>
          <View style={{margin:20}}>
            <Text style={{color:'gray', fontSize:15, fontWeight:'500'}}>Welcome back,</Text>
            <Text style={{fontSize:25, fontWeight:'bold'}}>Samuel Y</Text>
          </View>
          <View style={{flex:1}}>
            <View style={{flexDirection:'row', height:80, shadowColor:'black', shadowOpacity:0.2}}>
              <TextInput placeholder='Search...' placeholderTextColor={'gray'} style={{flex:1, fontWeight:'700', backgroundColor:'white', margin:20, borderRadius:10, elevation:1,}}/>
            </View>
            <View style={{zIndex:0}}>
              <View>
                <ScrollView scrollEventThrottle={16}>
                  <View>
                    <Text style={{fontSize: 19, fontWeight:'bold', paddingHorizontal:20}}>Categories</Text>
                  </View>
                  <View style={{height:130, marginTop: 20}}>
                    <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator = {false}>

                      <TouchableOpacity onPress={() => navigation.navigate('categories', {title: 'Tech', Posts:TechPosts})}>
                        <CategoryCard imageUri ={require("./CategoryImages/ipadPro.jpg")}/>
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => navigation.navigate('categories', {title: 'Automobiles', Posts:CarPosts})}>
                        <CategoryCard imageUri ={require("./CategoryImages/2015-lamborghini-aventador.jpg")} />
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => navigation.navigate('categories', {title: 'Homes',Posts:HomePosts})}>
                        <CategoryCard imageUri ={require("./CategoryImages/house.jpg")}/>
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => navigation.navigate('categories', {title: 'Bikes',Posts:BikePosts})}>
                        <CategoryCard imageUri ={require("./CategoryImages/bike.jpg")}/>
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => navigation.navigate('categories', {title: 'appliences',Posts:AppliencePosts})}>
                        <CategoryCard imageUri ={require("./CategoryImages/fridge.jpg")}/>
                      </TouchableOpacity>
                      
                    </ScrollView>
                  </View>
                </ScrollView>

              </View>
              <Text style={{color:'black', fontWeight:'bold', fontSize:19, paddingHorizontal:20}}>Top Posts</Text>
              <FlatList
              data={HomeScreenPosts}
              renderItem = {({item}) => (
                <TouchableOpacity onPress={() => navigation.navigate("post details", {PostTitle: item.title, Details:item.details, Description:item.description, images:[item.pic]})}>
                  <PostCard data ={item}/>
                </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
}
  
