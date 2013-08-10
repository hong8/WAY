// if the database is empty on server start, create some sample data.
Meteor.startup( function ()
{
    if ( Promises.find().count() === 0 )
    {
        var data = [
            {
                promise : 'Surf X',
                location : 'YangYang 4-12',
                date : '20130805',
                time : '0900',
                memo : '2013 1st vaca!!',
                participants : ['hong', 'sun', 'jihyun', 'chuja', 'yoona'],
                notified : false
            },
            {
                promise : 'Drinking~',
                location : 'SinNonHyun 1-1',
                date : '20130801',
                time : '1900',
                memo : 'ktds company meeting',
                participants : ['wongki', 'sangtae', 'seungwook', 'sejin'],
                notified : true
            },
            {
                promise : 'TOEIC Exam',
                location : 'PongNap High School, CheonhoDong 411-10',
                date : '20130828',
                time : '0900',
                memo : 'Target Score : 750',
                participants : ['sister', 'lover'],
                notified : false
            }
        ];

        var timestamp = (new Date()).getTime();
        for ( var i = 0; i < data.length; i++ ) {
            var promise_id = Promises.insert( data[i] );
            if ( i == 0 )
            {
                Questions.insert(
                    {
                        promise_id : promise_id,
                        question : 'Where do we go in summer vacation?',
                        options : [
                            { id : 1, option : 'YangYang' },
                            { id : 2, option : 'Busan' },
                            { id : 3, option : 'HongCheon' },
                            { id : 4, option : 'Jeju Island' }
                        ],
                        timestamp : timestamp++
                    }
                );

                Chats.insert( { promise_id : promise_id, user : 'hong', message : 'Hi Everybody. The school year is almost over. Do you have any plans for the summer holiday?' } )
                Chats.insert( { promise_id : promise_id, user : 'sun', message : 'I\'m planning on sleeping all day, every day!' } )
                Chats.insert( { promise_id : promise_id, user : 'sun', message : 'Oh, come on Jerry, you must be kidding.' } )
                Chats.insert( { promise_id : promise_id, user : 'jihyun', message : 'Yeah, I\'m just pulling your leg. Actually, I\'m going to go down to Guizhou Province.' } )
                Chats.insert( { promise_id : promise_id, user : 'yoona', message : 'Really? Why would you go to Guizhou? It\'s not a very popular tourist site.' } )
                Chats.insert( { promise_id : promise_id, user : 'chuja', message : 'Exactly! It\'s not very popular' } )
                Chats.insert( { promise_id : promise_id, user : 'chuja', message : 'I\'m sure Guizhou won\'t be so crowded. But won\'t it be too hot in the summer?' } )
                Chats.insert( { promise_id : promise_id, user : 'chuja', message : 'No, according to one of my students, it\'s very cool in the summer.' } )
                Chats.insert( { promise_id : promise_id, user : 'hong', message : 'He said it is "naturally air conditioned".' } )
                Chats.insert( { promise_id : promise_id, user : 'jihyun', message : 'Well, that sounds good.' } )
                Chats.insert( { promise_id : promise_id, user : 'sun', message : 'Still, I wonder... is there anything worth seeing in Guizhou?' } )
                Chats.insert( { promise_id : promise_id, user : 'jihyun', message : 'Sure! For one thing, there\'s the beautiful natural scenery.' } )
                Chats.insert( { promise_id : promise_id, user : 'chuja', message : 'Yes, I have heard of Huang Guo Shu Pubu, but won\'t you get bored just looking at the scenery?' } )
                Chats.insert( { promise_id : promise_id, user : 'chuja', message : 'We\'ll see what happens!' } )
                Chats.insert( { promise_id : promise_id, user : 'jihyun', message : 'Do you have a place to stay in Guizhou?' } )
                Chats.insert( { promise_id : promise_id, user : 'sun', message : 'Yes, I\'m very lucky.' } )
                Chats.insert( { promise_id : promise_id, user : 'jihyun', message : 'My student\'s sister is the manager of the Guizhou Park Hotel, the best hotel in the province.' } )
                Chats.insert( { promise_id : promise_id, user : 'chuja', message : 'That\'s great, Jerry. I\'m looking forward to seeing your photos when you get back.' } )

                var n1 = 1;
                var n2 = 4;
                var n3 = 1;
                var n4 = 10;
                for ( var j = 0; j < 10; j++ )
                {
                    Votes.insert(
                        {
                            promise_id : promise_id,
                            vote : Math.floor( (Math.random() * (n2 - n1 + 1)) + n1 ),
                            user : "man" + (j+1),
                            timestamp : timestamp++
                        }
                    );
                    var plan = Math.floor( (Math.random() * (n4 - n3 + 1)) + n3 );
                    var actual = Math.floor( (Math.random() * (n4 - n3 + 1)) + n3 );
                    Credits.insert(
                        {
                            user : "man" + (j+1),
                            contact : "content://com.android.contacts/contacts/" + (j+1),
                            plan : Math.max(plan, actual),
                            actual : Math.min(plan, actual),
                            timestamp : timestamp++
                        }
                    );
                }
            }
        }
    }
});
