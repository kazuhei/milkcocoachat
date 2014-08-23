// configuration
var milkcocoa = new MilkCocoa("https://io-ihyw9k58f.mlkcca.com");
var bearDataStore = milkcocoa.dataStore("bear");

enchant();

window.onload = function(){
    console.log('hello enchantjs');
	var core = new Core(320, 320);
	core.preload('chara1.png', 'pipo-map001.png');
	core.fps = 6;
	core.onload = function(){
        
        // <--- object configuration -->
        // 便利クラス
        var util = {
            getQueryString: function(){
                var result = {};
                if( 1 < window.location.search.length )
                {
                    var query = window.location.search.substring( 1 );
                    var parameters = query.split( '&' );
                    for( var i = 0; i < parameters.length; i++ )
                    {
                        var element = parameters[ i ].split( '=' );
                        var paramName = decodeURIComponent( element[ 0 ] );
                        var paramValue = decodeURIComponent( element[ 1 ] );
                        result[ paramName ] = paramValue;
                    }
                }
                return result;
            }
        }

        // bearを管理するクラス
        var bearBlockManager = {
            bearList: {},
            addBearBlock: function(username, bearBlock){
                this.bearList[username] = bearBlock;
                console.log('addBearBlock');
                return bearBlock;
            },
            getBearBlock: function(key){
                return this.bearList[key];
            },
        }

        // bearBlockクラス
        var BearBlock = Class.create(Group, {
            initialize: function(username, bearObj){
                Group.call(this);
                this.bear = bearObj;
                this.addChild(bearObj);
                var label = new Label();
                label.x = 0;
                label.y = 10;
                label.font = '12px "Arial"';
                label.text = username;
                this.addChild(label);
            }
        });

        
        // 自分のbearのクラス 
        var MyBear = Class.create(Sprite, {
            initialize: function(x, y){
                Sprite.call(this, 32, 32);
                this.x = x;
                this.y = y;
                this.image = core.assets['chara1.png'];
                           },
        });

        // 他ユーザーのbearのクラス
        var OtherBear = Class.create(Sprite, {
            initialize: function(x, y){
                Sprite.call(this, 32, 32);
                this.x = x;
                this.y = y;
                this.image = core.assets['chara1.png'];
                this.on('enterframe', function(){
                    this.frame = this.age % 3 + 5;
                });
            }
        });

        // sceneのテンプレートクラス
        var GameScene = Class.create(Scene, {
            initialize: function(string, stringColor, backgroundColor){
                Scene.call(this);
                this.backgroundColor = backgroundColor;
                var label = new Label();
                label.x = 80;
                label.y = 100;
                label.color = stringColor;
                label.font = '32px "Arial"';
                label.text = string;
                this.addChild(label);
            },
        });
        
        // <-- object configuration /-->
        var queryObj = util.getQueryString();
        var username = queryObj.username;

        var startScene = new GameScene('Game Start!', 'blue', '#EEE');
        var gameScene = new GameScene('','','#BBB');
        for(var i = 0; i < 10; i++){
            for(var j = 0; j < 10; j++){
                var bg = new Sprite(32, 32);
                bg.image = core.assets['pipo-map001.png'];
                bg.frame = 0;
                bg.x = 0 + 32*i;
                bg.y = 0 + 32*j;
                gameScene.addChild(bg);
            }
        }
        var tree = new Sprite(32, 32);
        tree.image = core.assets['pipo-map001.png'];
        tree.frame = 10;
        tree.x = 32*6;
        tree.y = 32*2;
        gameScene.addChild(tree);
        var tree2 = new Sprite(32, 32);
        tree2.image = core.assets['pipo-map001.png'];
        tree2.frame = 10;
        tree2.x = 32*3;
        tree2.y = 32*5;
        gameScene.addChild(tree2);
        var tree3 = new Sprite(32, 32);
        tree3.image = core.assets['pipo-map001.png'];
        tree3.frame = 10;
        tree3.x = 32*1;
        tree3.y = 32*3;
        gameScene.addChild(tree3);
        
        var input = new Entity();
        input.width = 300;
        input.height = 20;
        input.x = 6;
        input.y = 290;
        input._element = document.createElement('input');
        input._element.setAttribute("name","myText");
        input._element.setAttribute("type","text");
        gameScene.addChild(input);

        var myBear = new MyBear(0,0);
        var myBearBlock = new BearBlock(username, myBear);
        myBearBlock.on('enterframe', function(){
            if(core.input.left){this.x -= 5;}
		    if(core.input.right){this.x += 5;}
			if(core.input.up){this.y -= 5;}
    	    if(core.input.down){this.y += 5;}
	        this.bear.frame = this.age % 3;
            bearDataStore.child(username).set(
                {
                    name : username,
                    x : this.x,
                    y : this.y
                }
            ); 
        });

        bearBlockManager.addBearBlock(username, myBearBlock);
        gameScene.addChild(myBearBlock); 
        startScene.on('touchstart', function(){
            core.pushScene(gameScene);
        });
        core.pushScene(startScene);

        bearDataStore.on("set",function(data){
            console.log(bearBlockManager);
            console.log(data.id)
            bearBlock = bearBlockManager.getBearBlock(data.id);
            console.log(bearBlock);
            if(bearBlock != undefined){
                bearBlock.x = data.value.x;
                bearBlock.y = data.value.y;
            } else {
                otherBear = new OtherBear(data.value.x, data.value.y);
                otherBearBlock = new BearBlock(data.id, otherBear);
                bearBlockManager.addBearBlock(data.id, otherBearBlock);
                gameScene.addChild(otherBearBlock);
            }
        });
	}
	core.start();
};
