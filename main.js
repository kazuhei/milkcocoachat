// configuration
var milkcocoa = new MilkCocoa("https://io-ihyw9k58f.mlkcca.com");
var bearDataStore = milkcocoa.dataStore("bear");

enchant();

window.onload = function(){

	console.log('hello enchantjs');
	var core = new Core(320, 320);
	core.preload('chara1.png');
	core.fps = 6;
	core.onload = function(){

        // <--- object configuration -->
        
        // bearを管理するクラス
        var bearManager = {
            bearList: {},
            addBear: function(bearDataObj){
                bear = new OtherBear(bearDataObj.x, bearDataObj.y);
                this.bearList[bearDataObj.id] = bear;
                console.log('addBear');
            },
            getBear: function(key){
                return this.bearList[key];
            },
            putBears: function(scene){
                console.log(this.bearList);
                for(var bearId in this.bearList){
                    console.log(this.bearList[bearId]);
                    scene.addChild(this.bearList[bearId]);
                }
                console.log('putBears');
            },
        }
        
        // 自分のbearのクラス 
        var MyBear = Class.create(Sprite, {
            initialize: function(x, y){
                Sprite.call(this, 32, 32);
                this.x = x;
                this.y = y;
                this.image = core.assets['chara1.png'];
                this.on('enterframe', function(){
                    if(core.input.left){this.x -= 5;}
		    	    if(core.input.right){this.x += 5;}
			        if(core.input.up){this.y -= 5;}
    	    		if(core.input.down){this.y += 5;}
	        		this.frame = this.age % 3;
                    bearDataStore.child("arai").set(
                        {
                            name : 'arai',
                            x : this.x,
                            y : this.y
                        }
                    ); 
                    console.log('mybareset');
                });
            }
        });

        // 他ユーザーのbearのクラス
        var OtherBear = Class.create(Sprite, {
            initialize: function(x, y){
                Sprite.call(this, 32, 32);
                this.x = x;
                this.y = y;
                this.image = core.assets['chara1.png'];
                this.frame = 5;
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
            }
        });
        
        // <-- object configuration /-->
        
        var startScene = new GameScene('Game Start!', 'blue', '#EEE');
        var gameScene = new GameScene('','','#BBB');
        var myBear = new MyBear(0,0);
        gameScene.addChild(myBear);
        // bearたちを登録
        bearDataStore.query().done(
            function(bearData){
                console.log(bearData);
                $.each(bearData,function(i, bearDataObj){
                    bearManager.addBear(bearDataObj);
                });
                bearManager.putBears(gameScene);
           }
        );
        startScene.on('touchstart', function(){
            core.pushScene(gameScene);
        });
        core.pushScene(startScene);
        bearDataStore.on("set",function(data){
            bear = bearManager.getBear(data.id);
            bear.x = data.value.x;
            bear.y = data.value.y;
        });
	}
	core.start();
};
