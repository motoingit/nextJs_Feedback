int cmd;
    printf("Menu : insert(1) delete(2) getSize(3) isEmpty(4) ;\n");
    while (1){
        printf("Enter Command : ");
        scanf("%d", &cmd);
        switch (cmd){
        case 1:
            printf("Exit ing !\n");
            break;
        case 1:
            q->insert(10);
            break;
        
        case 2:
            q->deletee();
            break;

        case 3:
            q->getSize();
            break;

        case 4:
            q->isEmpty();
            break;

        case 5:
            q->print();
            break;

        case 6:
            q->rear();
            break;
        
        default:
            printf("wrong CMD : Try aganin \n");
            break;
        }
    }
