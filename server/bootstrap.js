// if the database is empty on server start, create some sample data.
Meteor.startup( function ()
{
    if ( WayUsers.find().count() == 0 )
    {
        var users = [
            { name : 'hong', id : '+821067351365', email :'', photo : '', state : 'goooooooooood!!', registration_id : 'APA91bGmmgZu9noaTO4FuWO_yVmp5AzpW6E_RzRehf10f0siSj1tbPRTQcEURlPYPGdrsv852zqyynkmjIEkG6fZyI-zGHOV42CTNv7sLCT9Zijt5IbdnBn6J98tq-rYbvAcuROIcvg0' },
            { name : 'sun', id : '+821011111111', email :'', photo : '', state : 'oooooooooooooops!!', registration_id : 'APA91bHJtjOKViajeIIh7MryLfXFM5UcCKZz7UqMGJWVAdKFAeLBYn3lCcZKqKeZlH2CvlToCzmNTjsZxT6QjKVpYtgd0kbXF7suUCRbZsoBgxY9aDZGMnGg3g2C95f_uSA7AmiIfITB' },
            { name : 'jihyun', id : '+821022222222', email :'', photo : '', state : 'blahblahblah!!', registration_id : '' },
            { name : 'chuja', id : '+821033333333', email :'', photo : '', state : 'kkkkkkkkkkkkkkk!!', registration_id : '' },
            { name : 'yoona', id : '+821044444444', email :'', photo : '', state : 'aaaaaaaaaaaa!!', registration_id : '' },
            { name : 'wongki', id : '+821055555555', email :'', photo : '', state : 'bbbbbbbbbb!!', registration_id : '' },
            { name : 'sangtae', id : '+821066666666', email :'', photo : '', state : 'ccccccccccccccccc!!', registration_id : '' },
            { name : 'seungwook',id : '+821077777777', email :'', photo : '', state : 'dddddddddddddd!!', registration_id : '' },
            { name : 'sejin', id : '+821088888888', email :'', photo : '', state : 'eeeeeeeeeeeeee!!', registration_id : '' },
            { name : 'sister', id : '+821099999999', email :'', photo : '', state : 'fffffffffffff!!', registration_id : '' },
            { name : 'lover', id : '+821000000000', email :'', photo : '', state : 'gggggggggggggg!!', registration_id : '' }
        ];

        for ( var i = 0; i < users.length; i++ ) {
            //var id = Meteor.users.insert(users[i]);
            var id = WayUsers.insert(users[i]);
        }
        var data = [
            {
                owner : users[0],
                promise : 'Surf X',
                location : { title : 'YangYang 4-12', latLng : { mb : 37.51812708456365, nb : 126.98118209838867 } },
                date : '20130905',
                time : '0900',
                memo : '2013 2st vaca!!',
                participants : [ users[0], users[1], users[2], users[3], users[4] ],
                notified : false
            },
            {
                owner : users[0],
                promise : 'Drinking~',
                location : { title : 'SinNonHyun 1-1', latLng : { mb : 37.51744630616677, nb : 126.95869445800781 } },
                date : '20131101',
                time : '1900',
                memo : 'ktds company meeting',
                participants : [ users[5], users[6], users[7], users[8] ],
                notified : true
            },
            {
                owner : users[0],
                promise : 'TOEIC Exam',
                location : { title : 'PongNap High School, CheonhoDong 411-10', latLng : { mb : 37.53861560711998, nb : 127.12331771850586 } },
                date : '20131028',
                time : '0900',
                memo : 'Target Score : 750',
                participants : [ users[9], users[10] ],
                notified : false
            }

        ];

        var timestamp = (new Date()).getTime();
        for ( var i = 0; i < data.length; i++ )
        {
            var promise_id = Promises.insert( data[i] );

            MyPromises.insert( { user_id : users[0]['id'], promise_id : promise_id, promise : data[i]['promise'], date : data[i]['date'] } );

            if ( i == 0 )
            {
                var options = [
                    { id : timestamp++, idx : 1, option : 'YangYang' },
                    { id : timestamp++, idx : 2, option : 'Busan' },
                    { id : timestamp++, idx : 3, option : 'HongCheon' },
                    { id : timestamp++, idx : 4, option : 'Jeju Island' }
                ]
                Questions.insert(
                    {
                        promise_id : promise_id,
                        question : 'Where do we go in winter vacation?',
                        options : options,
                        owner : users[0],
                        timestamp : timestamp++
                    }
                );

                Chats.insert( { promise_id : promise_id, user : users[0], message : 'Hi Everybody. The school year is almost over. Do you have any plans for the summer holiday?' } )
                Chats.insert( { promise_id : promise_id, user : users[1], message : 'I\'m planning on sleeping all day, every day!' } )
                Chats.insert( { promise_id : promise_id, user : users[1], message : 'Oh, come on Jerry, you must be kidding.' } )
                Chats.insert( { promise_id : promise_id, user : users[2], message : 'Yeah, I\'m just pulling your leg. Actually, I\'m going to go down to Guizhou Province.' } )
                Chats.insert( { promise_id : promise_id, user : users[0], message : 'Really? Why would you go to Guizhou? It\'s not a very popular tourist site.' } )
                Chats.insert( { promise_id : promise_id, user : users[3], message : 'Exactly! It\'s not very popular' } )
                Chats.insert( { promise_id : promise_id, user : users[4], message : 'I\'m sure Guizhou won\'t be so crowded. But won\'t it be too hot in the summer?' } )
                Chats.insert( { promise_id : promise_id, user : users[2], message : 'No, according to one of my students, it\'s very cool in the summer.' } )
                Chats.insert( { promise_id : promise_id, user : users[0], message : 'He said it is "naturally air conditioned".' } )
                Chats.insert( { promise_id : promise_id, user : users[2], message : 'Well, that sounds good.' } )
                Chats.insert( { promise_id : promise_id, user : users[1], message : 'Still, I wonder... is there anything worth seeing in Guizhou?' } )
                Chats.insert( { promise_id : promise_id, user : users[2], message : 'Sure! For one thing, there\'s the beautiful natural scenery.' } )
                Chats.insert( { promise_id : promise_id, user : users[0], message : 'Yes, I have heard of Huang Guo Shu Pubu, but won\'t you get bored just looking at the scenery?' } )
                Chats.insert( { promise_id : promise_id, user : users[3], message : 'We\'ll see what happens!' } )
                Chats.insert( { promise_id : promise_id, user : users[2], message : 'Do you have a place to stay in Guizhou?' } )
                Chats.insert( { promise_id : promise_id, user : users[1], message : 'Yes, I\'m very lucky.' } )
                Chats.insert( { promise_id : promise_id, user : users[2], message : 'My student\'s sister is the manager of the Guizhou Park Hotel, the best hotel in the province.' } )
                Chats.insert( { promise_id : promise_id, user : users[4], message : 'That\'s great, Jerry. I\'m looking forward to seeing your photos when you get back.' } )

                var n1 = 0;
                var n2 = 3;

                for ( var j = 0; j < 10; j++ )
                {
                    Votes.insert(
                        {
                            promise_id : promise_id,
                            vote : options[Math.floor( (Math.random() * (n2 - n1 + 1)) + n1 )]['id'],
                            user : randomuser(),
                            timestamp : timestamp++
                        }
                    );
                }
            }

            for ( var j = 0; j < data[i].participants.length; j++ )
            {
                var n3 = 1;
                var n4 = 10;
                var location = Math.floor( (Math.random() * (n4 - n3 + 1)) + n3 );
                Credits.insert(
                    {
                        promise_id : promise_id,
                        promise_date : data[i]['date'],
                        user : data[i].participants[j],
                        distance : Math.floor(location/50 * 100) / 100,
                        timestamp : timestamp++
                    }
                );
            }
        }

        localStorage = null;

        //WayFiles.insert( {aaa:'bbb'});
    }

    function randomuser()
    {
        var u1 = 0;
        var u2 = 4

        var n = Math.floor( (Math.random() * (u2 - u1 + 1)) + u1 );

        return users[n];
    }

});


