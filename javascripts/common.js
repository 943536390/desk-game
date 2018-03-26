function showPlayer(){
	var identifyArr = JSON.parse(sessionStorage.getItem("identifyArr"));
    console.log(identifyArr);
    var len = identifyArr.length;
    var wrap = document.getElementById("wrap");
    var gridNode = document.getElementById("grid1");
    var childArr = getChildNode(gridNode);
    var childNode = childArr[0];
    getChildNode(childNode).shift().innerText = identifyArr[0].role;

    if(!identifyArr[0].life){
        $("#grid1 .cover").css('opacity', '0.6');
        $("#grid1 .function").css('opacity', '0');
    }else{
        $("#grid1 .cover").css('opacity', '0');
        
    }
    for(var i=1;i<len;i++){   
        var newGridNode = gridNode.cloneNode(true);
        newGridNode.setAttribute("id", "grid-" + (i+1));
        var contentNode = getChildNode(newGridNode);
        var arr = getChildNode(contentNode[0]);
        arr[0].innerText = identifyArr[i].role;
        arr[1].innerText = (i+1)+"号";

        wrap.appendChild(newGridNode);
    if(!identifyArr[i].life){
        $(arr[2]).css('opacity', '0.6');
        if(contentNode[1]){
            $(contentNode[1]).css('opacity', '0');
        }
    }else{
        $(arr[2]).css('opacity', '0');
        if(contentNode[1]){
            $(contentNode[1]).css('opacity', '1');
        }

    }

    } 
}

function getChildNode(node){
        var arr = new Array();
        var nodes = node.childNodes;
        for(var i=0,len=nodes.length;i<len;i++){
            if(nodes[i].nodeType=="1"){
                arr.push(nodes[i]);
            }
        }
        return arr;
    }


function getURLParam(){
    // alert(window.location);
    // alert(window.location.search);
    var qs = window.location.search.length?location.search.substring(1):"";
    var arr = qs.length>0?qs.split("&"):[];
    var item = null,
        key = null,
        value = null,
        args={};
    for(var i=0,len=arr.length;i<len;i++){
        item = arr[i].split("=");
        key = decodeURIComponent(item[0]);
        value = decodeURIComponent(item[1]);
         if(key.length){
            args[key] = value;
         }
    }

    return args;

}

//操作indexedDB
/**
 * [getIndexedDB description]
 * @return indexedDB对象
 */
function getIndexedDB(){
    return window.indexedDB || window.msIndexedDB || window.mozIndexedDB || window.webkitIndexedDB;
}


function openDB (name,version) {
   return  new Promise(function(resolve){
        var version=version || 1;
            var idbRequest=getIndexedDB().open(name,version);
            idbRequest.onerror=function(e){
                console.log(e.currentTarget.error.message);
            };
            idbRequest.onsuccess=function(e){
                resolve(e.target.result); 
            };
            idbRequest.onupgradeneeded=function(e){
                var db=e.target.result;
                if(!db.objectStoreNames.contains('records')){
                    //db.createObjectStore('students',{autoIncrement: true});//keyGenerator
                    db.createObjectStore('records',{keyPath:"day"});
                }
                console.log('DB version changed to '+version);
            };
    });

}

//保存数据到objectStore
function saveData (db, storeName, data) {
        var transaction = db.transaction(storeName, 'readwrite');//需先创建事务
        var store = transaction.objectStore(storeName); //访问事务中的objectStore
        data.forEach(function (item) {
            store.add(item);//保存数据
        });
        console.log('save data done..'); 
}

//查找数据
function getDataByKey(db,storeName,key){
    return new Promise(function(resolve){
        var transaction=db.transaction(storeName,'readwrite'); 
        var store=transaction.objectStore(storeName); 
        var dataRequest=store.get(key); 
        dataRequest.onsuccess=function(e){//异步的
            resolve(e.target.result);
        };
        dataRequest.onerror=function(e){//异步的
            console.log(e.currentTarget.error.message);
        };
    });
    
}
//更新数据
function updateDataByKey(db,storeName,record){
    var transaction=db.transaction(storeName,'readwrite'); 
    var store=transaction.objectStore(storeName); 
    store.put(record); 
}
//删除数据
function deleteDataByKey(db,storeName,key){
    var transaction=db.transaction(storeName,'readwrite'); 
    var store=transaction.objectStore(storeName); 
    store.delete(key); 
}
//游标
function fetchStoreByCursor(db,storeName){
   return new Promise(function(resolve,reject){
    var transaction=db.transaction(storeName);
    var store=transaction.objectStore(storeName);
    var request=store.openCursor();
    request.onsuccess=function(e){
        resolve(e.target.result);
        // if(cursor){
        //     console.log(cursor.key);
        //     var currentStudent=cursor.value;
        //     console.log(currentStudent.name);
        //     cursor.continue();
        // }
    };
   });
    
}




