import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment'
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, filter, find, retry, timeout } from 'rxjs/operators';
import axios from 'axios';

axios.defaults.timeout = 1000 * 10;

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  protected baseUrl = environment.baseUrl

  constructor(private http: HttpClient) {
  }

  /** ===================== 搜索  ===================== */
  // 本地存储搜索记录
  getStorage(key: string) {
    // 读取本地储存，没有则返回空列表
    return JSON.parse(localStorage.getItem(key));
  }
  setStorage(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  removeStorage(key: string) {
    localStorage.removeItem(key);
  }

  // 搜索用户
  async userSuggest(q) {
    let httpUrl = this.baseUrl + `/search/user?q=${q}`;
    let result = await axios.get(httpUrl);
    return result.data;
  }

  // 股票推荐
  async stockSuggest(q) {
    let httpUrl = this.baseUrl + `/search/suggest_stock?q=${q}`;
    let result = await axios.get(httpUrl);
    return result.data;
  }

  // 组合推荐
  async groupSuggest(q) {
    let httpUrl = this.baseUrl + `/search/group?q=${q}`;
    let result = await axios.get(httpUrl);
    return result.data;
  }


  /** ===================== 首页  ===================== */
  // 指数数据
  async getMarket() {
    let httpUrl = this.baseUrl + '/home/quote';
    let result = await axios.get(httpUrl);
    return result.data;
  }

  // 获取新闻资讯 catetory=0 热帖 / catetory=1 7*24
  async getNews(catetory = 0, maxId) {
    if (maxId == undefined) {
      maxId = -1;
    }
    let httpUrl = this.baseUrl + `/home/news?category=${catetory}&maxId=${maxId}`;
    let result = await axios.get(httpUrl);
    return result.data;
  }

  // 获取热股榜
  async getHotStock(index = 12, type) {
    let httpUrl = this.baseUrl + `/home/hotStock?index=${index}&type=${type}`;
    let result = await axios.get(httpUrl);
    return result.data;
  }


  /** ===================== 帖子详情页 ===================== */
  // 热帖详情
  async gettopPost(userId, postId) {
    let httpUrl = this.baseUrl + `/topPost/details?userId=${userId}&postId=${postId}`;
    let result = await axios.get(httpUrl);
    // console.log(result.data);
    return result.data;
  }

  // 全部评论
  async getComment(id, page) {
    let httpUrl = this.baseUrl + `/topPost/comment?id=${id}&page=${page}`;
    let result = await axios.get(httpUrl);
    // console.log(result);
    return result.data;
  }

  // 精彩评论
  async getHotComment(id) {
    let httpUrl = this.baseUrl + `/topPost/comment_hot?id=${id}`;
    let result = await axios.get(httpUrl);
    // console.log(result);
    return result.data;
  }

  // 获取表情
  async getEmoji() {
    let httpUrl = this.baseUrl + `/topPost/emoji`;
    let result = await axios.get(httpUrl);
    // console.log(result);
    return result.data;
  }

  // 查看回复
  async getReplies(id) {
    let httpUrl = this.baseUrl + `/topPost/comment_replies?id=${id}`;
    let result = await axios.get(httpUrl);
    return result.data;
  }

  // 查看对话
  async getTalks(id, comment_id) {
    let httpUrl = this.baseUrl + `/topPost/comment_talks?id=${id}&comment_id=${comment_id}`;
    let result = await axios.get(httpUrl);
    return result.data;
  }


  /** ===================== 股票筛选 ===================== */
  // 获取行业
  async getIndustries(category = "CN") {
    let httpUrl = this.baseUrl + `/screener/industries?category=${category}`;
    let result = await axios.get(httpUrl);
    return result.data;
  }

  // 获取地区
  async getAreas() {
    let httpUrl = this.baseUrl + `/screener/areas`;
    let result = await axios.get(httpUrl);
    return result.data;
  }

  // 获取股票筛选条件
  async getConditions(category) {
    let httpUrl = this.baseUrl + `/screener/conditions?category=${category}`;
    let result = await axios.get(httpUrl);
    return result.data;
  }

  // 筛选字段范围
  async getFieldRange(category, field) {
    let httpUrl = this.baseUrl + `/screener/fields?category=${category}&field=${field}`;
    let result = await axios.get(httpUrl);
    return result.data;
  }

  // 获取筛选股票
  async getSelectStock(options) {
    let httpUrl = this.baseUrl + `/screener/selectStock`;
    let result = await axios.get(httpUrl, { params: options });
    return result.data;
  }

  // 获取股票排行
  async getStockRank(category, order_by, order?) {
    if (!order) order = "desc";
    let httpUrl = this.baseUrl + `/screener/stockRank?category=${category}&order_by=${order_by}&order=${order}`;
    let result = await axios.get(httpUrl);
    return result.data;
  }


  /** ===================== 新股上市 ===================== */

  // http请求错误处理
  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }

  // 获取行业类型
  getIndustry() {
    let httpUrl = this.baseUrl + `/newStock/industry`;
    return this.http.get(httpUrl).pipe(
      timeout(1000 * 7),
      retry(2),
      catchError(this.handleError)
    );
  }

  // 获取新股上市股票列表
  getStockPreipo(order_by, order, type, size = 10, page = 1) {
    let httpUrl = this.baseUrl + `/newStock/preipo?order_by=${order_by}&order=${order}&type=${type}&size=${size}&page=${page}`;
    return this.http.get(httpUrl).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  // 获取各股票列表
  getStockQuote(exchange, type, size = 30, page, ind_code?) {
    let httpUrl = this.baseUrl + `/newStock/quote?page=${page}&exchage=${exchange}&market=${exchange}&type=${type}&ind_code=${ind_code}&size=${size}`;
    return this.http.get(httpUrl).pipe(
      timeout(1000 * 7),
      retry(2),
      catchError(this.handleError)
    );
  }

  /** ===================== 登录注册===================== */
  // 安全校验
  safeCheck() {
    let httpUrl = this.baseUrl + `/login/safe`;
    return this.http.get(httpUrl).pipe(
      timeout(1000 * 7),
      retry(2),
      catchError(this.handleError)
    );
  }
}
