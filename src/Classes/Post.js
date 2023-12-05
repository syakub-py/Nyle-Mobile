import _ from 'lodash';
import {
	fetchMarketData,
	fetchPost,
	processPostForLike,
	updatePostWithCurrencyPrice,
	updateViewCount
} from '../Firebase/AllPosts';
import {makeAutoObservable} from "mobx"

export class Post {
  constructor(postData) {
	makeAutoObservable(this)
    this.postedBy = postData.postedBy || '';
    this.SQFT = postData.SQFT || 0;
    this.USD = postData.USD || 0;
    this.bathrooms = postData.bathrooms || 0;
    this.bedrooms = postData.bedrooms || 0;
    this.category = postData.category || '';
    this.coordinates = postData.coordinates || {};
    this.currencies = postData.currencies || '';
    this.date = postData.date || new Date().toLocaleString();
    this.description = postData.description || '';
    this.id = postData.id || '';
    this.likes = postData.likes || [];
    this.pictures = postData.pictures || [];
    this.profilePicture = postData.profilePicture || '';
    this.sold = postData.sold || false;
    this.title = postData.title || '';
    this.views = postData.views || 0;
  }

	async handleLikeCounter (username, setLiked) {
		try {
			const doc = await fetchPost(this.title);
			if (doc.exists) {
				this.likes = doc.data().likes || [];
				this.likes = await processPostForLike(doc, username, setLiked, this.title);
			}
		} catch (error) {
			console.error('Error handling like counter:', error);
		}
	}

	async handleViewCounter () {
		try {
			const doc = await fetchPost(this.title);
			const currentViews = doc.data().views;
			this.views = currentViews + 1;
			await updateViewCount(this.title, this.views);
			return currentViews;
		  } catch (error) {
			console.error('Error handling view counter:', error);
			return null;
		  }
	}

	async updateCurrencyPrice() {
		let price = 0;
		try {
		  const marketData = await fetchMarketData();
		  const filteredData = marketData.filter(item => item.image === this.currencies[0].value);
		  if (!_.isEmpty(filteredData)) {
			price = filteredData[0].current_price;
		  }

		  const doc = await fetchPost(this.title);
		  if (doc.exists) {
			await updatePostWithCurrencyPrice(doc, price, this.title);
		  }
		} catch (error) {
		  console.log(error.message);
		}
	  }

	// This function returns the same thing regardless of the size of currencies
	updatedCurrencyList () {
		if (_.size(this.currencies)>1) {
			return this.currencies;
		} else {
			return this.currencies;
		}
	};

	isLiked = (username) =>{
		return this.likes.includes(username);
	};
}
