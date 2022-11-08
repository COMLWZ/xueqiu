import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NewsService } from '../../service/news.service';
import { ViewportScroller } from '@angular/common'; // 操作页面滚动条
import { Title } from '@angular/platform-browser'; // 修改页面title
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.less']
})

export class CommentComponent implements OnInit {
  private userId;
  private postId;

  pageLoading = false; // 页面加载中

  article: any = { 'author': '', 'title': '', 'description': '', 'article': '' }; // 帖子详情
  Comments: any; // 评论
  hotComments: any; // 精彩评论
  emojis: [string]; // 表情地址
  emoLoad: boolean | string = false; // 未加载表情

  emoPanel = null; // 记录被打开的表情面板
  emoFlag = null; // 是否收起表情面板

  replyObj = { title: '' }; // 回复/对话详情
  isVisible = false; // 回复面板是否打开
  lookComment = []; // 正在查看的评论
  commentType = "reply"; // 回复或对话
  isSpinning: boolean | string = false; // 回复面板内容加载中

  currentPage = 1; // 评论分页当前页
  prePage = 1; // 上一次浏览的页码

  constructor(private modal: NzModalService, private route: ActivatedRoute, private router: Router, private postSer: NewsService, private scroller: ViewportScroller, private title: Title, private message: NzMessageService) {
    this.route.params.subscribe(data => {
      // 获取动态路由路径参数
      console.log(data);
      if (isNaN(data.userId) || isNaN(data.postId)) {
        this.router.navigate(["**"], {
          replaceUrl: true,
        });
      }

      this.userId = data.userId;
      this.postId = data.postId;
    });
  }

  ngOnInit(): void {
    let pgLoad = setTimeout(() => {
      // 防闪烁
      this.pageLoading = true;
    }, 500);

    this.postSer.gettopPost(this.userId, this.postId).then(data => {
      clearTimeout(pgLoad);
      this.pageLoading = false;
      console.log('帖子：', data);
      this.article = data;
      // 帖子 去除src前面的转义符\
      // this.article.article = this.article.article.split('\\').join('');
      this.article.article = this.article.article.replace(/\\/g, '');

      // 设置页面标题
      this.title.setTitle(this.article.title + this.article.description);

      this.postSer.getHotComment(this.postId).then(data => {
        this.hotComments = data;
        console.log("精彩评论", data);
      });
      this.pageChange(true);
    }, err => {
      this.article.error = "error";
      this.pageLoading = false;
      this.modal.confirm({
        nzTitle: '提示',
        nzContent: '此正文限制合格投资人查看。请先登录！',
        nzOkText: '去登录',
        nzWidth: 280,
        nzIconType: "exclamation-circle",
        nzMask: false,
        nzCentered: true,
        nzOnCancel: () => {
          this.router.navigateByUrl("");
        },
        nzOnOk: () => { 
          this.router.navigateByUrl("/account/login");
        }
      });
    });
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.

  }


  // 评论框得到失去焦点
  // EditorFocus($event) {
  //   $event.target.previousSibling.style.display = 'none';

  // }
  // EditorBlur($event) {
  //   if ($event.target.innerHTML == "") {
  //     $event.target.previousSibling.style.display = 'block';
  //   }
  // }

  // 获取表情
  getEmojis($event?) {
    if ($event) {
      $event.stopPropagation();
    }
    if (!this.emoLoad || this.emoLoad == 'error') {
      this.emoLoad = true;
      // 获取表情成功后再点击不发送请求
      this.postSer.getEmoji().then(res => {
        this.emojis = res;
        this.emoLoad = 'finish';
      }).catch(err => {
        this.emoLoad = 'error';
      });
    }
  }
  // 打开表情面板
  openEmoPanel($event) {
    $event.preventDefault(); // 阻止默认行为
    // $event.stopPropagation(); // 阻止冒泡

    let panel = $event.currentTarget.nextSibling; // 表情面板
    let editor = $event.currentTarget.parentNode.parentNode.parentNode.previousSibling.lastChild; // 评论框

    if (this.emoPanel && this.emoPanel != panel) {
      // 鼠标按下关闭上一个打开的评论框
      this.emoPanel.style.display = "none";
      this.emoFlag = null;
    }

    if (panel.style.display == "block") {
      panel.style.display = "none";
      // this.emoPanel = null;
    } else {
      panel.style.display = "block";
      this.emoPanel = panel;
    }

    this.getEmojis();

    let selection = window.getSelection();
    if (editor == document.activeElement) {
      let range = selection.getRangeAt(0); // 光标对象
      let endDom = range.endContainer; // 光标所在节点
      let offset = range.endOffset; // 光标所在节点偏移量
      selection.collapse(endDom, offset);
    } else {
      // 评论框未得到焦点
      editor.focus();
      // selection = window.getSelection();
      let range = selection.getRangeAt(0); // 获得焦点后获取光标对象
      range.selectNodeContents(editor); // 选中评论框
      selection.collapseToEnd(); // 光标移到评论框内容末尾
    }

    const emoUp = () => {
      if (this.emoFlag) {
        // 如果表情面板已打开 鼠标点击页面收起面板
        panel.style.display = "none";
        this.emoFlag = null;
        document.onclick = null;
      } else {
        this.emoFlag = true;
      }
    }
    document.onclick = emoUp;
  }

  // 表情输入
  emojiInput($event) {
    $event.stopPropagation();

    // 需要克隆DOM对象 否则会将原位置的图片拿到评论框
    let emoji = $event.target.cloneNode();
    // 编辑框
    let editor = $event.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.previousSibling.lastChild;
    editor.focus();
    if (window.getSelection) {
      let selection = window.getSelection(); // 获取选定对象
      let range = selection.getRangeAt(0); // 光标对象
      // range.deleteContents(); 删除内容

      // 插入一个节点
      range.insertNode(emoji);
      selection.collapseToEnd();
    }
  }

  // 回复
  replay($event) {
    let editor: any = $event.currentTarget.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.nextSibling;
    // console.log(editor);
    if (editor.style.display == "flex") {
      editor.style.display = "none";
    } else {
      editor.style.display = "flex";
      editor.querySelector(".textbox").focus();
    }
  }

  // 输入取消
  inputCancel($event, show?) {
    // 传入参数show则只取消输入而不隐藏编辑框
    let editor = $event.currentTarget.parentNode.parentNode.parentNode.parentNode;
    let edit = editor.querySelector(".textbox");
    edit.innerHTML = null;
    if (!show) {
      editor.style.display = "none";
    }
  }

  // 获取评论回复
  getReplies(id, type, index) {
    this.isVisible = true;
    this.isSpinning = true;
    this.postSer.getReplies(id).then(res => {
      this.isSpinning = false;
      res.title = '查看回复 （' + res.replies.length + '）';
      this.replyObj = res;
      console.log('回复', this.replyObj);

      this.commentType = "reply";
      this.lookComment = [];
      if (type == "hot") { // 精彩评论
        this.lookComment.push(this.hotComments.comments[index]);
      } else { // 全部评论
        this.lookComment.push(this.Comments.comments[index]);
      }
      console.log('正在浏览的评论', type, index, this.lookComment);
    }, err => {
      this.isSpinning = "error";
      this.message.error("加载失败，网络发生了点小问题，请稍后重试");
    });
  }

  // 获取对话
  getTalks(comment_id, type, index) {
    this.isVisible = true;
    this.isSpinning = true;
    this.postSer.getTalks(this.postId, comment_id).then(res => {
      this.isSpinning = false;
      res.title = '查看对话';
      this.replyObj = res;
      console.log('对话', this.replyObj);

      this.commentType = "talks";
      this.lookComment = [];
      if (type == "hot") {
        this.lookComment.push(this.hotComments.comments[index]);
      } else {
        this.lookComment.push(this.Comments.comments[index]);
      }
      console.log('正在浏览的对话', type, index, this.lookComment);
    }, err => {
      this.isSpinning = "error";
      this.message.error("加载失败，网络发生了点小问题，请稍后重试");
    });
  }
  // 回复面板取消
  handleCancel(): void {
    this.isVisible = false;
  }

  // 页面改变回调
  pageChange(type?: boolean) {
    let id;
    if (!type) {
      id = this.message.loading('评论加载中...', { nzDuration: 0 }).messageId;
    }
    this.postSer.getComment(this.postId, this.currentPage).then(data => {
      console.log('评论：', data);
      this.Comments = data;
      this.prePage = this.currentPage;
      if (!type) {
        this.message.remove(id);
        this.message.success("评论加载完成", { nzDuration: 1500 });
      }
    }, err => {
      this.currentPage = this.prePage; // 加载失败页码不变
      this.message.remove(id); // 移除
      this.message.error("评论加载失败，请稍后重试");
    });
  }
  toTop() {
    // 定位到锚点
    this.scroller.scrollToAnchor("commentAnchor");
    document.documentElement.scrollTop -= 60;
  }
}
