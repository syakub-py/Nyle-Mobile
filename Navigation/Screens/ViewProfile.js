import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, Pressable,Dimensions, ScrollView } from 'react-native';
import faker from 'faker';
import PostCard from './Components/PostCard';
import { useNavigation } from '@react-navigation/native';

export default function ViewProfile({route}){
    const navigation = useNavigation(); 
    const PersonPosts = [
        {
          id:1,
          title: faker.address.streetAddress(),
          price: "50",
          currency: "https://logos-world.net/wp-content/uploads/2020/08/Bitcoin-Logo.png",
          location: "New York, NY",
          details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut imperdiet ut nisl ac venenatis. Pellentesque bibendum lectus risus. Etiam et tristique dolor. Sed et purus at lectus semper ullamcorper in non est. Curabitur venenatis nunc sit amet tortor venenatis commodo. Donec eu malesuada urna. Duis vulputate semper luctus. Nam aliquam est sit amet leo malesuada, id sodales sapien dapibus. Sed ornare ante vel metus placerat ornare. Pellentesque non risus venenatis, porttitor tellus sit amet, fringilla sem. Nam vitae elit vitae ex tincidunt pretium. ",
          description: "In nec gravida ex. Aliquam ultricies diam aliquam consectetur eleifend. Donec massa odio, sagittis sit amet finibus ac, suscipit lacinia metus. Sed nulla nulla, placerat eu volutpat at, pretium sed nulla. Ut dignissim enim in enim dapibus, in sollicitudin nulla sagittis. Curabitur nec turpis sed massa consequat gravida iaculis in orci. Ut tincidunt hendrerit nunc, a finibus urna vulputate vel. Quisque luctus mauris sed laoreet venenatis. Nunc convallis eleifend leo, quis sollicitudin leo condimentum in. Suspendisse accumsan erat nulla, quis venenatis lectus aliquam ut. Maecenas tempor nulla vel consectetur efficitur.",
          pic: 'https://images.pexels.com/photos/323776/pexels-photo-323776.jpeg?auto=compress&cs=tinysrgb&w=300',
          profilePic: `https://randomuser.me/api/portraits/${faker.helpers.randomize(['women', 'men'])}/${faker.random.number(60)}.jpg`,
        },
        {
          id:2,
          title: faker.address.streetAddress(),
          price: "50",
          currency: "https://logos-world.net/wp-content/uploads/2020/08/Bitcoin-Logo.png",
          location: "New York, NY",
          details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut imperdiet ut nisl ac venenatis. Pellentesque bibendum lectus risus. Etiam et tristique dolor. Sed et purus at lectus semper ullamcorper in non est. Curabitur venenatis nunc sit amet tortor venenatis commodo. Donec eu malesuada urna. Duis vulputate semper luctus. Nam aliquam est sit amet leo malesuada, id sodales sapien dapibus. Sed ornare ante vel metus placerat ornare. Pellentesque non risus venenatis, porttitor tellus sit amet, fringilla sem. Nam vitae elit vitae ex tincidunt pretium. ",
          description: "In nec gravida ex. Aliquam ultricies diam aliquam consectetur eleifend. Donec massa odio, sagittis sit amet finibus ac, suscipit lacinia metus. Sed nulla nulla, placerat eu volutpat at, pretium sed nulla. Ut dignissim enim in enim dapibus, in sollicitudin nulla sagittis. Curabitur nec turpis sed massa consequat gravida iaculis in orci. Ut tincidunt hendrerit nunc, a finibus urna vulputate vel. Quisque luctus mauris sed laoreet venenatis. Nunc convallis eleifend leo, quis sollicitudin leo condimentum in. Suspendisse accumsan erat nulla, quis venenatis lectus aliquam ut. Maecenas tempor nulla vel consectetur efficitur.",
          pic: 'https://nypost.com/wp-content/uploads/sites/2/2020/08/hamptons-housing-04.jpg?quality=75&strip=all&w=744',
          profilePic: `https://randomuser.me/api/portraits/${faker.helpers.randomize(['women', 'men'])}/${faker.random.number(60)}.jpg`,
        },
        {
          id:3,
          title: faker.address.streetAddress(),
          price: "50",
          currency: "https://w7.pngwing.com/pngs/368/176/png-transparent-ethereum-cryptocurrency-blockchain-bitcoin-logo-bitcoin-angle-triangle-logo-thumbnail.png",
          location: "New York, NY",
          details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut imperdiet ut nisl ac venenatis. Pellentesque bibendum lectus risus. Etiam et tristique dolor. Sed et purus at lectus semper ullamcorper in non est. Curabitur venenatis nunc sit amet tortor venenatis commodo. Donec eu malesuada urna. Duis vulputate semper luctus. Nam aliquam est sit amet leo malesuada, id sodales sapien dapibus. Sed ornare ante vel metus placerat ornare. Pellentesque non risus venenatis, porttitor tellus sit amet, fringilla sem. Nam vitae elit vitae ex tincidunt pretium. ",
          description: "In nec gravida ex. Aliquam ultricies diam aliquam consectetur eleifend. Donec massa odio, sagittis sit amet finibus ac, suscipit lacinia metus. Sed nulla nulla, placerat eu volutpat at, pretium sed nulla. Ut dignissim enim in enim dapibus, in sollicitudin nulla sagittis. Curabitur nec turpis sed massa consequat gravida iaculis in orci. Ut tincidunt hendrerit nunc, a finibus urna vulputate vel. Quisque luctus mauris sed laoreet venenatis. Nunc convallis eleifend leo, quis sollicitudin leo condimentum in. Suspendisse accumsan erat nulla, quis venenatis lectus aliquam ut. Maecenas tempor nulla vel consectetur efficitur.",
          pic: 'https://images.squarespace-cdn.com/content/v1/58487dc4b8a79b6d02499b60/1650194082470-72Q6R35RXYETS0ZBRBL0/Francis+York+Iconic+Oceanfront+Estate+for+Sale+in+the+Hamptons%2C+NY+1.jpeg?format=1500w',
          profilePic: `https://randomuser.me/api/portraits/${faker.helpers.randomize(['women', 'men'])}/${faker.random.number(60)}.jpg`,
        },
        {
          id:4,
          title: faker.address.streetAddress(),
          price: "10",
          currency: "https://seeklogo.com/images/D/dogecoin-doge-logo-625F9D262A-seeklogo.com.png?v=637919377460000000",
          location: "New York, NY",
          details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut imperdiet ut nisl ac venenatis. Pellentesque bibendum lectus risus. Etiam et tristique dolor. Sed et purus at lectus semper ullamcorper in non est. Curabitur venenatis nunc sit amet tortor venenatis commodo. Donec eu malesuada urna. Duis vulputate semper luctus. Nam aliquam est sit amet leo malesuada, id sodales sapien dapibus. Sed ornare ante vel metus placerat ornare. Pellentesque non risus venenatis, porttitor tellus sit amet, fringilla sem. Nam vitae elit vitae ex tincidunt pretium. ",
          description: "In nec gravida ex. Aliquam ultricies diam aliquam consectetur eleifend. Donec massa odio, sagittis sit amet finibus ac, suscipit lacinia metus. Sed nulla nulla, placerat eu volutpat at, pretium sed nulla. Ut dignissim enim in enim dapibus, in sollicitudin nulla sagittis. Curabitur nec turpis sed massa consequat gravida iaculis in orci. Ut tincidunt hendrerit nunc, a finibus urna vulputate vel. Quisque luctus mauris sed laoreet venenatis. Nunc convallis eleifend leo, quis sollicitudin leo condimentum in. Suspendisse accumsan erat nulla, quis venenatis lectus aliquam ut. Maecenas tempor nulla vel consectetur efficitur.",
          pic: 'https://newyorkaktuell.nyc/app/uploads/2019/01/D9A0BCAF_91B8_7137_797B_501406CCD777_1050x700.0-1024x683.jpg',
          profilePic: `https://randomuser.me/api/portraits/${faker.helpers.randomize(['women', 'men'])}/${faker.random.number(60)}.jpg`,
        },
      ]
    return(
        <SafeAreaView>
            <View>
                <FlatList
                ListHeaderComponent={
                    <View> 
                        <View style={{alignItems:'center', paddingTop:60}}>
                            <Image resizeMode='cover' source={{uri: route.params.ProfileImage}} style={{height:200, width:200, borderRadius:100}}/>
                            <View>
                                <Text style={{fontSize:25, fontWeight:'700', paddingTop:10}}>{faker.name.findName()}</Text>
                            </View>
                        </View>

                        <Text style={{margin:20, fontSize:20, fontWeight:'500'}}>Posts</Text>
                    </View>
                }
                data = {PersonPosts}
                renderItem = {({item}) => (
                    <Pressable onPress={() => navigation.navigate("post details", {PostTitle: item.title,Price:item.price, Details:item.details, Description:item.description, images:[item.pic], Currency:item.currency, Location: item.location})}>
                        <PostCard data ={item}/>
                    </Pressable>
                    )}
                />
            </View>
        </SafeAreaView>
    )
}