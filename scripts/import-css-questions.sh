#!/bin/bash

# CSS题目批量导入脚本
# 使用方法: bash scripts/import-css-questions.sh

BASE_URL="http://localhost:5000/api/proxy"

echo "=== 开始导入CSS题目 ==="

# 1. 检查服务是否运行
echo "检查服务状态..."
if ! curl -s --head http://localhost:5000 | head -n 1 | grep -q "200"; then
    echo "错误：Next.js服务未运行，请先启动服务"
    exit 1
fi
echo "✓ 服务正常运行"

# 2. 创建CSS分类（如果不存在）
echo "检查CSS分类..."
CATEGORY_RESPONSE=$(curl -s "$BASE_URL/categories")
CATEGORY_ID=$(echo "$CATEGORY_RESPONSE" | grep -o '"id":"[^"]*","name":"CSS"' | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$CATEGORY_ID" ]; then
    echo "创建CSS分类..."
    CREATE_RESPONSE=$(curl -s -X POST "$BASE_URL/categories" \
        -H "Content-Type: application/json" \
        -d '{"name":"CSS","order":1}')
    CATEGORY_ID=$(echo "$CREATE_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
    echo "✓ CSS分类创建成功，ID: $CATEGORY_ID"
else
    echo "✓ CSS分类已存在，ID: $CATEGORY_ID"
fi

# 3. 添加题目
echo ""
echo "开始添加题目..."

# 题目1: 隐藏元素的方法
echo "添加题目 1/13: 隐藏元素的方法有哪些"
curl -s -X POST "$BASE_URL/questions" \
    -H "Content-Type: application/json" \
    -d '{
        "title":"隐藏元素的方法有哪些",
        "content":"**display: none**：渲染树不会包含该渲染对象，因此该元素不会在页面中占据位置，也不会响应绑定的监听事件。\n\n**visibility: hidden**：元素在页面中仍占据空间，但是不会响应绑定的监听事件。\n\n**opacity: 0**：将元素的透明度设置为 0，以此来实现元素的隐藏。元素在页面中仍然占据空间，并且能够响应元素绑定的监听事件。\n\n**position: absolute**：通过使用绝对定位将元素移除可视区域内，以此来实现元素的隐藏。\n\n**z-index: 负值**：来使其他元素遮盖住该元素，以此来实现隐藏。\n\n**clip/clip-path**：使用元素裁剪的方法来实现元素的隐藏，这种方法下，元素仍在页面中占据位置，但是不会响应绑定的监听事件。\n\n**transform: scale(0,0)**：将元素缩放为 0，来实现元素的隐藏。这种方法下，元素仍在页面中占据位置，但是不会响应绑定的监听事件。",
        "categoryId":"'$CATEGORY_ID'",
        "isFrequent":false
    }' > /dev/null

# 题目2: link和@import的区别
echo "添加题目 2/13: link和@import的区别"
curl -s -X POST "$BASE_URL/questions" \
    -H "Content-Type: application/json" \
    -d '{
        "title":"link和@import的区别",
        "content":"两者都是外部引用CSS的方式，它们的区别如下：\n\n- **link**是XHTML标签，除了加载CSS外，还可以定义RSS等其他事务；**@import**属于CSS范畴，只能加载CSS。\n- **link**引用CSS时，在页面载入时同时加载；**@import**需要页面网页完全载入以后加载。\n- **link**是XHTML标签，无兼容问题；**@import**是在CSS2.1提出的，低版本的浏览器不支持。\n- **link**支持使用Javascript控制DOM去改变样式；而**@import**不支持。",
        "categoryId":"'$CATEGORY_ID'",
        "isFrequent":true
    }' > /dev/null

# 题目3: transition和animation的区别
echo "添加题目 3/13: transition和animation的区别"
curl -s -X POST "$BASE_URL/questions" \
    -H "Content-Type: application/json" \
    -d '{
        "title":"transition和animation的区别",
        "content":"- **transition是过渡属性**，强调过度，它的实现需要触发一个事件（比如鼠标移动上去，焦点，点击等）才执行动画。它类似于flash的补间动画，设置一个开始关键帧，一个结束关键帧。\n- **animation是动画属性**，它的实现不需要触发事件，设定好时间之后可以自己执行，且可以循环一个动画。它也类似于flash的补间动画，但是它可以设置多个关键帧（用@keyframe定义）完成动画。",
        "categoryId":"'$CATEGORY_ID'",
        "isFrequent":true
    }' > /dev/null

# 题目4: display:none与visibility:hidden的区别
echo "添加题目 4/13: display:none与visibility:hidden的区别"
curl -s -X POST "$BASE_URL/questions" \
    -H "Content-Type: application/json" \
    -d '{
        "title":"display:none与visibility:hidden的区别",
        "content":"这两个属性都是让元素隐藏，不可见。两者**区别如下：**\n\n（1）**在渲染树中**\n\n- \`display:none\`会让元素完全从渲染树中消失，渲染时不会占据任何空间；\n- \`visibility:hidden\`不会让元素从渲染树消失，渲染的元素还会占据相应的空间，只是内容不可见。\n\n（2）是否是**继承属性**\n\n- \`display:none\`是非继承属性，子孙节点会随着父节点从渲染树消失，通过修改子孙节点的属性也无法显示；\n- \`visibility:hidden\`是继承属性，子孙节点消失是由于继承了\`hidden\`，通过设置\`visibility:visible\`可以让子孙节点显示；\n\n（3）修改常规文档流中元素的 \`display\` 通常会造成文档的重排，但是修改\`visibility\`属性只会造成本元素的重绘；\n\n（4）如果使用读屏器，设置为\`display:none\`的内容不会被读取，设置为\`visibility:hidden\`的内容会被读取。",
        "categoryId":"'$CATEGORY_ID'",
        "isFrequent":true
    }' > /dev/null

# 题目5: 伪元素和伪类的区别和作用？
echo "添加题目 5/13: 伪元素和伪类的区别和作用？"
curl -s -X POST "$BASE_URL/questions" \
    -H "Content-Type: application/json" \
    -d '{
        "title":"伪元素和伪类的区别和作用？",
        "content":"- **伪元素**：在内容元素的前后插入额外的元素或样式，但是这些元素实际上并不在文档中生成。它们只在外部显示可见，但不会在文档的源代码中找到它们，因此，称为"伪"元素。例如：\n\n\`\`\`css\np::before {content:"第一章：";}\np::after {content:"Hot!";}\np::first-line {background:red;}\np::first-letter {font-size:30px;}\n\`\`\`\n\n- **伪类**：将特殊的效果添加到特定选择器上。它是已有元素上添加类别的，不会产生新的元素。例如：\n\n\`\`\`css\na:hover {color: #FF00FF}\np:first-child {color: red}\n\`\`\`\n\n**总结：**伪类是通过在元素选择器上加⼊伪类改变元素状态，⽽伪元素通过对元素的操作进⾏对元素的改变。",
        "categoryId":"'$CATEGORY_ID'",
        "isFrequent":true
    }' > /dev/null

# 题目6: 对requestAnimationframe的理解
echo "添加题目 6/13: 对requestAnimationframe的理解"
curl -s -X POST "$BASE_URL/questions" \
    -H "Content-Type: application/json" \
    -d '{
        "title":"对requestAnimationframe的理解",
        "content":"实现动画效果的方法比较多，Javascript 中可以通过定时器 setTimeout 来实现，CSS3 中可以使用 transition 和 animation 来实现，HTML5 中的 canvas 也可以实现。除此之外，HTML5 提供一个专门用于请求动画的API，那就是 requestAnimationFrame，顾名思义就是**请求动画帧**。\n\nMDN对该方法的描述：\n\nwindow.requestAnimationFrame() 告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行。\n\n**语法：** \`window.requestAnimationFrame(callback);\`  其中，callback是**下一次重绘之前更新动画帧所调用的函数**(即上面所说的回调函数)。该回调函数会被传入DOMHighResTimeStamp参数，它表示requestAnimationFrame() 开始去执行回调函数的时刻。该方法属于**宏任务**，所以会在执行完微任务之后再去执行。\n\n**取消动画：**使用cancelAnimationFrame()来取消执行动画，该方法接收一个参数——requestAnimationFrame默认返回的id，只需要传入这个id就可以取消动画了。\n\n**优势：**\n\n- **CPU节能**：使用SetTinterval 实现的动画，当页面被隐藏或最小化时，SetTinterval 仍然在后台执行动画任务，由于此时页面处于不可见或不可用状态，刷新动画是没有意义的，完全是浪费CPU资源。而RequestAnimationFrame则完全不同，当页面处理未激活的状态下，该页面的屏幕刷新任务也会被系统暂停，因此跟着系统走的RequestAnimationFrame也会停止渲染，当页面被激活时，动画就从上次停留的地方继续执行，有效节省了CPU开销。\n- **函数节流**：在高频率事件( resize, scroll 等)中，为了防止在一个刷新间隔内发生多次函数执行，RequestAnimationFrame可保证每个刷新间隔内，函数只被执行一次，这样既能保证流畅性，也能更好的节省函数执行的开销，一个刷新间隔内函数执行多次时没有意义的，因为多数显示器每16.7ms刷新一次，多次绘制并不会在屏幕上体现出来。\n- **减少DOM操作**：requestAnimationFrame 会把每一帧中的所有DOM操作集中起来，在一次重绘或回流中就完成，并且重绘或回流的时间间隔紧紧跟随浏览器的刷新频率，一般来说，这个频率为每秒60帧。\n\n**setTimeout执行动画的缺点**：它通过设定间隔时间来不断改变图像位置，达到动画效果。但是容易出现卡顿、抖动的现象；原因是：\n\n- settimeout任务被放入异步队列，只有当主线程任务执行完后才会执行队列中的任务，因此实际执行时间总是比设定时间要晚；\n- settimeout的固定时间间隔不一定与屏幕刷新间隔时间相同，会引起丢帧。",
        "categoryId":"'$CATEGORY_ID'",
        "isFrequent":false
    }' > /dev/null

# 题目7: 对盒模型的理解
echo "添加题目 7/13: 对盒模型的理解"
curl -s -X POST "$BASE_URL/questions" \
    -H "Content-Type: application/json" \
    -d '{
        "title":"对盒模型的理解",
        "content":"CSS3中的盒模型有以下两种：标准盒子模型、IE盒子模型\n\n盒模型都是由四个部分组成的，分别是margin、border、padding和content。\n\n**标准盒模型和IE盒模型的区别**在于设置width和height时，所对应的范围不同：\n\n- **标准盒模型**的width和height属性的范围只包含了content，\n- **IE盒模型**的width和height属性的范围包含了border、padding和content。\n\n可以通过修改元素的box-sizing属性来改变元素的盒模型：\n\n- \`box-sizing: content-box\`表示标准盒模型（默认值）\n- \`box-sizing: border-box\`表示IE盒模型（怪异盒模型）",
        "categoryId":"'$CATEGORY_ID'",
        "isFrequent":true
    }' > /dev/null

# 题目8: 为什么有时候⽤translate来改变位置⽽不是定位？
echo "添加题目 8/13: 为什么有时候⽤translate来改变位置⽽不是定位？"
curl -s -X POST "$BASE_URL/questions" \
    -H "Content-Type: application/json" \
    -d '{
        "title":"为什么有时候⽤translate来改变位置⽽不是定位？",
        "content":"translate 是 transform 属性的⼀个值。改变transform或opacity不会触发浏览器重新布局（reflow）或重绘（repaint），只会触发复合（compositions）。⽽改变绝对定位会触发重新布局，进⽽触发重绘和复合。transform使浏览器为元素创建⼀个 GPU 图层，但改变绝对定位会使⽤到 CPU。 因此translate()更⾼效，可以缩短平滑动画的绘制时间。 ⽽translate改变位置时，元素依然会占据其原始空间，绝对定位就不会发⽣这种情况。",
        "categoryId":"'$CATEGORY_ID'",
        "isFrequent":false
    }' > /dev/null

# 题目9: li 与 li 之间有看不见的空白间隔是什么原因引起的？如何解决？
echo "添加题目 9/13: li 与 li 之间有看不见的空白间隔是什么原因引起的？如何解决？"
curl -s -X POST "$BASE_URL/questions" \
    -H "Content-Type: application/json" \
    -d '{
        "title":"li 与 li 之间有看不见的空白间隔是什么原因引起的？如何解决？",
        "content":"浏览器会把inline内联元素间的空白字符（空格、换行、Tab等）渲染成一个空格。为了美观，通常是一个\`<li>\`放在一行，这导致\`<li>\`换行后产生换行字符，它变成一个空格，占用了一个字符的宽度。\n\n**解决办法：**\n\n（1）为\`<li>\`设置float:left。不足：有些容器是不能设置浮动，如左右切换的焦点图等。\n\n（2）将所有\`<li>\`写在同一行。不足：代码不美观。\n\n（3）将\`<ul>\`内的字符尺寸直接设为0，即font-size:0。不足：\`<ul>\`中的其他字符尺寸也被设为0，需要额外重新设定其他字符尺寸，且在Safari浏览器依然会出现空白间隔。\n\n（4）消除\`<ul>\`的字符间隔letter-spacing:-8px，不足：这也设置了\`<li>\`内的字符间隔，因此需要将\`<li>\`内的字符间隔设为默认letter-spacing:normal。",
        "categoryId":"'$CATEGORY_ID'",
        "isFrequent":false
    }' > /dev/null

# 题目10: CSS3中有哪些新特性
echo "添加题目 10/13: CSS3中有哪些新特性"
curl -s -X POST "$BASE_URL/questions" \
    -H "Content-Type: application/json" \
    -d '{
        "title":"CSS3中有哪些新特性",
        "content":"- 新增各种CSS选择器 （: not(.input)：所有 class 不是"input"的节点）\n- 圆角 （border-radius:8px）\n- 多列布局 （multi-column layout）\n- 阴影和反射 （Shadoweflect）\n- 文字特效 （text-shadow）\n- 文字渲染 （Text-decoration）\n- 线性渐变 （gradient）\n- 旋转 （transform）\n- 增加了旋转,缩放,定位,倾斜,动画,多背景",
        "categoryId":"'$CATEGORY_ID'",
        "isFrequent":true
    }' > /dev/null

# 题目11: 替换元素的概念及计算规则
echo "添加题目 11/13: 替换元素的概念及计算规则"
curl -s -X POST "$BASE_URL/questions" \
    -H "Content-Type: application/json" \
    -d '{
        "title":"替换元素的概念及计算规则",
        "content":"通过修改某个属性值呈现的内容就可以被替换的元素就称为"替换元素"。\n\n替换元素除了内容可替换这一特性以外，还有以下特性：\n\n- **内容的外观不受页面上的CSS的影响**：用专业的话讲就是在样式表现在CSS作用域之外。如何更改替换元素本身的外观需要类似appearance属性，或者浏览器自身暴露的一些样式接口。\n- **有自己的尺寸**：在Web中，很多替换元素在没有明确尺寸设定的情况下，其默认的尺寸（不包括边框）是300像素×150像素\n- **在很多CSS属性上有自己的一套表现规则**：比较具有代表性的就是vertical-align属性，对于替换元素和非替换元素，vertical-align属性值的解释是不一样的。比方说vertical-align的默认值的baseline，很简单的属性值，基线之意，被定义为字符x的下边缘，而替换元素的基线却被硬生生定义成了元素的下边缘。\n- **所有的替换元素都是内联水平元素**：也就是替换元素和替换元素、替换元素和文字都是可以在一行显示的。但是，替换元素默认的display值却是不一样的，有的是inline，有的是inline-block。\n\n替换元素的尺寸从内而外分为三类：\n\n- **固有尺寸：** 指的是替换内容原本的尺寸。例如，图片、视频作为一个独立文件存在的时候，都是有着自己的宽度和高度的。\n- **HTML尺寸：** 只能通过HTML原生属性改变，这些HTML原生属性包括的width和height属性、的size属性。\n- **CSS尺寸：** 特指可以通过CSS的width和height或者max-width/min-width和max-height/min-height设置的尺寸，对应盒尺寸中的content box。\n\n这三层结构的计算规则具体如下：\n\n（1）如果没有CSS尺寸和HTML尺寸，则使用固有尺寸作为最终的宽高。\n\n（2）如果没有CSS尺寸，则使用HTML尺寸作为最终的宽高。\n\n（3）如果有CSS尺寸，则最终尺寸由CSS属性决定。\n\n（4）如果"固有尺寸"含有固有的宽高比例，同时仅设置了宽度或仅设置了高度，则元素依然按照固有的宽高比例显示。\n\n（5）如果上面的条件都不符合，则最终宽度表现为300像素，高度为150像素。\n\n（6）内联替换元素和块级替换元素使用上面同一套尺寸计算规则。",
        "categoryId":"'$CATEGORY_ID'",
        "isFrequent":false
    }' > /dev/null

# 题目12: 常见的图片格式及使用场景
echo "添加题目 12/13: 常见的图片格式及使用场景"
curl -s -X POST "$BASE_URL/questions" \
    -H "Content-Type: application/json" \
    -d '{
        "title":"常见的图片格式及使用场景",
        "content":"（1）**BMP**，是无损的、既支持索引色也支持直接色的点阵图。这种图片格式几乎没有对数据进行压缩，所以BMP格式的图片通常是较大的文件。\n\n（2）**GIF**是无损的、采用索引色的点阵图。采用LZW压缩算法进行编码。文件小，是GIF格式的优点，同时，GIF格式还具有支持动画以及透明的优点。但是GIF格式仅支持8bit的索引色，所以GIF格式适用于对色彩要求不高同时需要文件体积较小的场景。\n\n（3）**JPEG**是有损的、采用直接色的点阵图。JPEG的图片的优点是采用了直接色，得益于更丰富的色彩，JPEG非常适合用来存储照片，与GIF相比，JPEG不适合用来存储企业Logo、线框类的图。因为有损压缩会导致图片模糊，而直接色的选用，又会导致图片文件较GIF更大。\n\n（4）**PNG-8**是无损的、使用索引色的点阵图。PNG是一种比较新的图片格式，PNG-8是非常好的GIF格式替代者，在可能的情况下，应该尽可能的使用PNG-8而不是GIF，因为在相同的图片效果下，PNG-8具有更小的文件体积。除此之外，PNG-8还支持透明度的调节，而GIF并不支持。除非需要动画的支持，否则没有理由使用GIF而不是PNG-8。\n\n（5）**PNG-24**是无损的、使用直接色的点阵图。PNG-24的优点在于它压缩了图片的数据，使得同样效果的图片，PNG-24格式的文件大小要比BMP小得多。当然，PNG24的图片还是要比JPEG、GIF、PNG-8大得多。\n\n（6）**SVG**是无损的矢量图。SVG是矢量图意味着SVG图片由直线和曲线以及绘制它们的方法组成。当放大SVG图片时，看到的还是线和曲线，而不会出现像素点。SVG图片在放大时，不会失真，所以它适合用来绘制Logo、Icon等。\n\n（7）**WebP**是谷歌开发的一种新图片格式，WebP是同时支持有损和无损压缩的、使用直接色的点阵图。从名字就可以看出来它是为Web而生的，什么叫为Web而生呢？就是说相同质量的图片，WebP具有更小的文件体积。现在网站上充满了大量的图片，如果能够降低每一个图片的文件大小，那么将大大减少浏览器和服务器之间的数据传输量，进而降低访问延迟，提升访问体验。目前只有Chrome浏览器和Opera浏览器支持WebP格式，兼容性不太好。\n\n- 在无损压缩的情况下，相同质量的WebP图片，文件大小要比PNG小26%；\n- 在有损压缩的情况下，具有相同图片精度的WebP图片，文件大小要比JPEG小25%~34%；\n- WebP图片格式支持图片透明度，一个无损压缩的WebP图片，如果要支持透明度只需要22%的格外文件大小。",
        "categoryId":"'$CATEGORY_ID'",
        "isFrequent":false
    }' > /dev/null

# 题目13: 对 CSSSprites 的理解
echo "添加题目 13/13: 对 CSSSprites 的理解"
curl -s -X POST "$BASE_URL/questions" \
    -H "Content-Type: application/json" \
    -d '{
        "title":"对 CSSSprites 的理解",
        "content":"CSSSprites（精灵图），将一个页面涉及到的所有图片都包含到一张大图中去，然后利用CSS的 background-image，background-repeat，background-position属性的组合进行背景定位。\n\n**优点：**\n\n- 利用\`CSS Sprites\`能很好地减少网页的http请求，从而大大提高了页面的性能，这是\`CSS Sprites\`最大的优点；\n- \`CSS Sprites\`能减少图片的字节，把3张图片合并成1张图片的字节总是小于这3张图片的字节总和。\n\n**缺点：**\n\n- 在图片合并时，要把多张图片有序的、合理的合并成一张图片，还要留好足够的空间，防止板块内出现不必要的背景。在宽屏及高分辨率下的自适应页面，如果背景不够宽，很容易出现背景断裂；\n- \`CSS Sprites\`在开发的时候相对来说有点麻烦，需要借助\`photoshop\`或其他工具来对每个背景单元测量其准确的位置。",
        "categoryId":"'$CATEGORY_ID'",
        "isFrequent":false
    }' > /dev/null

echo ""
echo "✓ 所有题目添加完成！"
echo "请访问 http://localhost:5000 查看效果"
