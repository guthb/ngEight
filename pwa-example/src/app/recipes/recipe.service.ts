import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';

import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';



@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

  // private recipes: Recipe[] = [
  //   new Recipe('Crazy Fries', 'not just tasty but crazy tastey', 'http://blog.fleischerei-freese.de/wp-content/uploads/2008/08/p8222535.JPG', [
  //     new Ingredient('potato', 1),
  //     new Ingredient('cheese', 1),
  //     new Ingredient('radish', 1)
  //   ]),

  //   new Recipe('Greasy Bacon Suprise', 'Bleeaah, just gross', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhMTEhMVFRMXGB8XGBcYGRgZGhkaGR8bIBoeGhgYHSggGh8lGxoYITEhJSkrLi4uGh8zODMtNygtLisBCgoKDg0OGxAQGy0lHyUvLS0tLTUtLS0tLS0tLS0vNS0tLS0tLS0tLy0tLS8tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAMMBAwMBIgACEQEDEQH/xAAbAAACAwEBAQAAAAAAAAAAAAADBAIFBgABB//EAD4QAAECBAQEBAUDAwMDBAMAAAECEQADITEEEkFRBWFxgSKRofAGEzKxwULR4RRS8RUjYjOCkkOiwtJTcrL/xAAZAQADAQEBAAAAAAAAAAAAAAABAgMEAAX/xAAtEQACAgEDAgQFBAMAAAAAAAAAAQIRAxIhMQRBEyJRcWGBkcHwMqGx8RRC0f/aAAwDAQACEQMRAD8Azgl6e9hTztBkJ8vZ62HOIoQbNXb0He5pvDf9IoLUktQtQhQ0diDZga1h6M55IlOXbmeepr1Ii5wPDvIP6U05k+UJCUUqClBejMxzKNS9Bl/Td9awfiPEHGRNAzfd/qtr7EccOY/iSZfhlh9z2ahoRT7mM/PxqlE5iSWJ3sHP5MCnB7ksKmra6u/SF5Ru19PWJyk7GSGno5saOa+V4XXiBoR76dI6ajwk0e/cUI9Qe0Kke/SJTbKJBFbkj3y8ogrZ37cv59Yi2vv0iClAaN151+0TY6QRTtz97RGVML1V209sO8QC2oTUi1DT2fSCBg4gUMcVE2HnbzYw5hMNMmUQgrOrW5VhaXLJ0pv6ax9I+AsClUgg0WVFzvt6NrvBoaCTPn0zBrSTmSRppeJqwiiWAKn2FKnz0jdfEvw+rKUhTE2NTU0DDuKRmpfA1AOpYJT/AHOl9ix0Zq8xE4ZHpbcTU+jUmtMvqVJwS9UK7D+DHSVqQWS4OxD+b2bnGt4TwMmaDMSGdyOoP2LRZcf+FHSlUkPoUvVjqNH5Wh4ztXwRy9No2uz56qYpqntblyiKFEF6jV++8XWJ4HMQgrLtmysQQTzhdfBJqZfzCkpRzoa9ucNqV8kPDlXAqMUpvEyuv7wzhpiV+H6VabEiw3ELLwxFxTQ7v/EEl4Y93ZjTXYvDqVE3AKlJ6bDqe2sSExmozDT+dTyMAzGj3H833vEkzAb3b8b0iqmTcS94f8RGWwW6kjqbMee32i4xGHlzkZ5VdWuaBZqP4/nELlVJPvz6HWLHAY0p1OU0arVfr7Ol4rGQrQTH4HKSO2n/ABitnSvfc8+UbVK0T0uKLcAhw9VJf0FmjO43Bs/R7DZRhqFKJaPddh+8AWPfnFjNksSGq7eqRvCsxHuvOFGFGFtd9Bu9KwJQhhSfflAlD35wAgSI6J5Y6FCXcmVpr+1OlyYtcJh8oc0TUjR9KPS3PUQLASLF2+1Nza5j3iGNp8tL5QTW+z/T0r3h+BAfEOIUUlNOVdORcDQdhFcV0fT2NIXnLc+p++kBfc+/ZiLmUURsEHvoe3TSAKYW/wA6/Zo8zn8fiBLVE5SsZImqbStv8mAlbNvakeH3369IGHJ2bQEtvX0hCiQQ+/tHZKdagelWgeHWFEvRnvejtTrByo+Qb35wyo52gQFXPfp7EO8Nw4Wqr5Xt6lzb7QpkNddmbppDODnhJCiFdAW1oR2av8xwaNJJlBkhspzCjCqRdg/hdimz1B2i5wuOKUpyEJUGoQK1SA51oDsaRkf9SWF5gSXFUhwEmtAbmz31qTWHMZxFIzfKUSkgEKUkglWoZ1Cxb7wJub9KNeJ4YRSfPr6Go4jxgFfiWlFKJU58XNQsOrROc0xKnysCAllF1NUhLWDgb3HKMZO4jnSmVlbXMAHNLU5k3rasXHBsWnKUrCsyD9YASAHsKgioFhY9IEFbcTVLw1FSi+DQtkISmhv11NakgBx2h0z5p/VycP6bj9ooF8YTmyrASCzOUupqsFA1qb79YLgcaJRTlBXQNlVcOT4jQWp/22ECUUmBRclfJdf0/wDUS8igz/Vza8ExcofJ+WlLmgYCIypyQlCkHLmcEKOvIm5el9XgU3EEBJJZWajkM97dMw8jHKCW5OTvb9hHESUOgKQkBJBZtRy3izxaZK5bEBiHYh3MQnhC1KBUMxLh9AP51iuxGHXLOVJClXyswannR/2jtVXQFjUqVlHxvhiUJCpb5RQpqTWxFadOcZybKY0Zi7NrX3pG44nMSBmIe5Kbt2ao+0UWO4c//TAKLsDWt8pN4VZUtpCZukbWqBSonFLbP09fKDzQHIFrAsxbnT8/vE1y7ACwZwGpzH5gfv3b7RshweZJU6Y5hMSpJoot1fa1wT7rGiStM+VT6gkg1DlksOnlGUHv+Cf3hvAY5SCCHb+OhHvSKJk2ifEcJlUaan/+216RUzE07ctj79iNjPSmckLADuHqLuom3bSM3jJDDt/8eY5wzAVUxPL24hdSffnD01Ne/L+7mIVWPty2MKFAGj2JhPtxHQgTV4qbkSAGzHUfwX8xoIosTN90/wA+xDHFMQ5NelS9OttYq1n3v7rAlIMYnEhi/vziJj337blESffvlEWVR6stq7fiInV/bezElD3X8wTDYcqLAE9A/OwgBSAAXq1P4ECEklKnZyKO4qbFqCzVjX4X4TWpAUyWIqFGv/iQWq9OUND4QJH1HoAwtAcki0YSMciX+pn0dqtUtEpKK++vLlFjiuGLlrKGdj7p+Id4N8NzpqmYpSxdRr0o8BZIvhheGfdFAlFHbv7HOOyn9vYjVzfgyehzRTMzajXkPWH8Z8HKbOCwAcgl37mA5oKwyZjcOlyx7l7WFXY6w1NknKGWCx08ntow6RoOG8IlIUFnxnZmAreh09tF3j5kpgoS/quKlma5DGJvqKul9i8ekb5f3PnstKgrNqXterjTd4KiZMSrOlWUpLpL1cWPiH5rTtucJwXD/MSrKVAh8ug89L+UWGL+GcLNDI/21Crp8Lv6GLKTfYjLC49z5cqcumZvDYgDS1QDzLHyizmYpBbIkhDDOnwkmtb0UGOzuDDfHvhmbIU58SFHwqp5dYqcTJIDB77eVwdt/KDygLJOD2dGil8YlkoSpzkJykgOKg0S7aAQ6ri8spWwDhO6WBKmeoKQQVXagjEykKTV/EA4PpVqNflDw4wsTFzUJCUVAAP0UoxABJfuQKx0bT3e3sXWdNbrf3NLOwonELzEKFDeu3etQOcH4cFgkKcuXBILX5nrXnEPhfHJnEJXlzuQokh1Xaty4i4xSxhyQlyl6PU1sIk4NytcGuOS46Xv6f2VOJwq1rLAAgfT9ww08oLIQEFj4qApA2/NjEJeIOYqdWVQcEimtq109a0h3EoSpIUlwsBxpbkbgOatCUk9+QxyulFrYQ4tgjiElSMudBZqeIdRrzjKPmuCCCx3Bc/UNPKNNNxapZDJyqFyaP7+0SxfDJeIHzJagJl1ChfQgnl+O0PHI4ukQ6npFJal+fnqZJam96RJvf8AEdjpGTNmcAb2pT3+IFJux7cqj3aNMcl8HkzxuOzLng/EClVT4Te7V6g9Yc4rhQQSliGNuiNooEFiGZ+w32YxoOGzc6Mh5AOT/wAbP03/AJ0JkGZ/Eor3vX+5XLl7rCKx9uf9sXmMksabjnqs6H36xUTEsNbc/wC1PPn7tHMIvlv1O/7R0MCTehudFbnnHQp1ns8gB6k+7BuY9mEkj30/mGJs0l9B72gYk1qCkNc9H5UiElb2LJ7CeIn5SNU+r+9IIFvXQ25igf1jp8twz0b+exiGFkKQWSonQOxrbStzCU7KbNfEfwGE+YoJ01NKB4+g8LwwQwyMOQaMPhPCtJoSDTbwtRrjS8afhOLE+YlQBCEv4SWJXQuUszXAY+jvKal4ivg19PGLhtya/DlLMKjbSPFqZ3FDCk+cJX1BtSOvKM/xL4pGdikZKhxfUBzUbUjnNLnk0Q6dvhbBeKmXMmy0uLkF2B6Au7vyMX3AsegOgMSlhQgjkxF4wnEOIlSgVSgg0Zna6S5J0FRRut4f4R8pLqSQhZB/VTqwVlaxezdDCRVS8q39fsaMkE403sfRFYrN+mAzE/MBCmAH79altIpsBxo5QQlMwZakFnUyrCvh8ID1qTtVed8QAzEoyqSQA6gKFRDhwbUzBne43jVst2YvDdtRR7j5cmUA+WWpyBmVShJIzMN9dQBpAJ+HXNQTL1Bq7AaXudrNFnhsOuY7qLElgGAq99y2sHn4E5bk16xCUNW9GmMtNJvco+GTRLYL3ZQytlazqtXZxrtW4m4lOUqSzDVyTQ3rQC1eY3gMiYn/AKawA9if7tndx/mK3FcOUlLEEO5BBdjd6/Yvq3KcMuhaWq+IzUZztjs3GOlSFrBlrFyxSmlGIPSgfW0VON4PJCAU5kk6pcm1wHqPXSF5iZiXDqUhwQCQkpKaOFE0YP6DnHsviiCJaSPpKQc6iQlJFdbE5fqcFrgiKQeOfmTOyYG9kr+h7K+B1zUlSpgSdAAVerg+9YyfFeEzcPMUlavApg4DIcl21HaliY+r8H4n81BZq/nQwzN4OmfLUmaHzAjZr2a0US1K4mKcNDakqPlPwzxb5astQCq6Xo5OgLXU+xzCNqJiZ6WWMydyLcjcafaPn+P4HNkYhSC6gghJGq01YpcUJi54ZjjLUlalK+X9KcxqnVmBcpzBszU6sI6MW2Vx5IpaX8jWT8Iw8AcMyhyblyF+UV0lYc3Sbu/qNB2pFtgMU7FSnJGYku7XcGxury1pDU7Ay1AqCgk3Y0qeQ786R04ItrS2kCVgAoZVWyuHavOp3/PdDFyTJWkpAIYDpTfpEMVip4NqJAIDaj3fnBsNjvnAJV4V6JIr35N0hJ6ODsanFW90BxvC0zXJSkk2KXfmeT9Yxs+TlUxb2Tv9o3SStNJgozUJDjRx5VjKcUlgzJhzOcz6XZ7Dn/MJhjpk0uDN1quKZWzJjAa2+2ukN4PEZVBQ02/g099kimrcvxBZi2+1fJ6iN0ZWeVJF/wAQRmTmA056Bf8AcNyP8xnMRL+pgPT/AIc/b9YusBNBQoKsAWvc5hoaaaaQhxCWyldTe90biKkxOUQ1k3Oidzzj2OkqDXGuqd//ANY6BQSuKqt39tDSlhQYUJ0/zHsuS6ANTUWo9neFyWO3sj7RLdFCJFtfPqYnJQwrRzRq2c6MRVonLl0KlW/BPLkDBJpLDUkO1jWutqAekChkC+Sv6UjxqIYalgb6Uzda841f9YrCS0zJoecv/pSUgA0Z1q2AeguSw5jOYfiJlqzlPiT9Iyg3dTuRd+lKRycUVzlrU5WSyjQuBWnIEAU7O8RnG5GzFk0Y9jSYr4r+af8AdlLDghJOUXpYGhezxnsVlUgpQVEoOZSyFBgbU8rULh49mz8pDGzcqitO/wCITlTAtwVNvqaClKc/WBDFGLH/AMyemkqPZstYJKPl5S7hVA5bRXR4jIExA/QTzUS1aWBDO/mI4ynBqWrqRp0pE1J2+2wGzQZRT7HQ6vLHhjEiYs+FkOLMSX20Bsfy0WOH4kshKSHUmxUBTkFuCxGp3MBlnwgkVGlrDZY5mPflt9IIINwOVapJ1LQPCS4C+tyP9W5peD/EgQ0uYCxo6SC3YF9Pd4t8LxiU7/MCgbA69N4wE2UHOqux2GrHlBVzZskFaZeawIYuQlnpVq67E2hfCfZ8HQzRk/MuTYcUwucH5RyLcnMHSp6sXDUABBv2aEMNgZvhUFqcBwSsqrc0N/Lzix4VxeXMlkUTlSXYAvyqW1NecMJCDLARlUhmFAC96kddIZ44s2RlKOxXYgTVFKZvyyk/qAKSNC9W2feK3iOAAKgVAgfpYgsS4qLh9BGr/pZShYJXuag93pCvEOD/ADF51KzOlsosCCWNVaA+o2icsMd6dMaOZJqym4LjFSgGVmGiB9SRs2rcnpGokceTv2Znf7d4puJYABKllRKCf1pFCP7S2rhuh3gCeFpmkG6kpABCnBvQpOwAsbmCnOGyOkoZfNIrvi3HpmrlqSLUL61FKgu29bxSoUCKDY0pUVJLc+UWuO4asF1Aghz9Tg0YsBUORXYtyeuMwnrUB/YMVxO0ed1ePTK1wwuFx6wpTEVrlJCUg1KimnhJoGsX5CLXhvGgopQpwBuEgk2+lxroxbneM6iYoUXTUC5B1rtQc6Xia8MDmsH1AYirUI/j0ikraOxdTo2luj6LJUCkliwqrcPWjVo4pFViMKhEzMm5r0Yu1ehio4Px7IMk5eVTEFWV8wuCWNCDrdvKPOI4pCpaykgrDELHtmZnprvEcjjV0b8a7xezNinLOl86EH+IwnF5P+8thap8jyjQfDEuYZed2CtOesUfHiUrWDdVSa2ZIbzEddyRlzR043H2KhQZ+h771iIG7EHlz1bpHstNTs1T3tv3jgUmr++8VjyebLgb4dMZQpyLgWrvB+IymLlTg2sB9Q2J2EIy6EG1Oe3ff28PT0ugBIJLOE3JYh2bSp035toRFlZKNBf/AN34EewtOmMfEpjRwQXBarvWOgnUGlzAU8hu2nUbwnODF0+f+OcGmyi7ClH2FK/doFiMKokB3y70D3ah39iIyspFIPJmZkl6kDlyAvWBTFlzcaU8um/rEQo5QDpfen8xA1D/AL6BoDdjJbjK1ZmFn1oblg+Vnta14nhkMVAgCwpR36jb8QCYoO4blarDQadIbkLLkA0GrZSSKBxvX0gdxux7/TJUrM3cDc0djZnpE0SUvQX7ip51Jb8WicuSzkavW/00vTUxIbtaw9BQvb2LQaBYulDBbgbgaVL6aNE8OCty/hJAtmDlT0BavTfSIY7DhawkqsTQXJDAA5Vah6n/ADo+GfDClVUkZRZJL6av+Im5UaMeJy7iOCw5WQE0fmQK1uXAoPUXgn+kzTMVLSUg1YlNNDoR70rG0RhTLlgZWyWCbMYymP4yUzCkIcix1FDWjasHO0QzSlXldM3dP00He1nk/gc5DfMIW9yxoQX1tv7MV+NKgwApr4VCjm2UtsLecXmF44paSVoUlnym2Yl8tam3IVF4R4hxpTBKkEeEBgfpI0s4A8XSOU5rn8+Yz6OL9/cz2HShABQ4apUFqBAJFEsaWuN4sZPGJkumZRTQpEx3cbKZnd99AYuOHy5C1D/bQk3LpBLbimtf/GI8U+H5dMgIcg+FyARYlD8zUDTUWp52roVQeN1q+vA/hPiWUtOWcooIrlUPDQ/3g5TWwcBwLuIfwWJzIdKqU21vrVjt+YwyUFAcKExKWBBSyqhxZrgu96QxN4SEJTMUmhZRKSUllXzBq6EaUO8HxIv9SGuUeV9N/wBjbgzFBSVqdG2Ukc7eIU3GsV/DZ6E5yQUm+WlHf0NCCPWMwnETQFZZq20Z6hlEEABgLHRniUnHTUspQCmAcJqSC5JNqt+kO336VrdI6ObHTV8/Ci8kcQlzZikNm1f8BT7ENsbi0VXE+HKlKKSVFJsotUkv0f733gnDUSBMVNQrw2YEOH0Y9vLaBcc4sqYEoAIYli7OA+nlpCwVPUu4vUwUo/BFbMJBetNgd6PVh/mkeS5gcC5oaOx7io+8Tlop4qm51FByNYEhSEOGAer0ZyLb/wCKRc8k9xErMluTX6b9BHcJxKZSjmSBLX4aFykgCpBLsSrvXaAyWsbVZ36QUyyPEkkKFQbszbQJJSVMpjyPG7Rs+HY9MoAN4SKbEaFJJ/eKz4sxkpeQJb5grzbuXP8AiKKZj2WlWUENQUet2IFd661aIiaMoNSolyTcuwr5HlAarhmnJ1EZx43FsUrwlyz/AL6QQS2y6UH2raJJlZmLVBccqG3aOzOzXDtfblBit7MTe1Ei1bmlDT1bk/8AMNYeWFJUJgdi6XJ1Z9LU1/iECQQ4Ls9N+599Gh7hivE5BIq6Q9ajUEnTrF0RZWT5aX0FBSg0GjR5DE9wogEgbOTpyEeQ1nEAkUsxZzWyj5WhbELY3BJDnvXv/mJ0AJS2tXoHFKOdRbnHTUAvatjrVho238RN8DpAZCgo+JdbGgqHc3t7rE8EFAlExIfNQgMcv1VvoWBgmHls7Eu2v/IsOzQvMnqcOlIUCfpa1hV9gadYRuh1vsFxIGbKzpUmpBN9qVHNqvqxr5gwyk3Aejl6XYq/LQyjDlYYBSyXqA40AqfdqQsq5/uBNC4I0HekLqKVJIspcqpJLgtTKk1+q4r668nhfH4syxluVAUr4Q4Ki5PXpS8S/rLFqudjSzp390gfEpGcpWhSQpizuQQSG5vQt6wZbrY7FSmtfBdfD65aJiEJRlSoguAQTVnBADkUJJux3i/RxBSl/UtFWJNWboKWZoxfD+KGWQFJUkKYFqs1MoUa5bt/iGF8Rmqf5a8yHY/Te9SWLlw2/NohJxWyTPYxpT4o1eO4qQMqVGaosGfLlB1JIo4BjPTH+Yj5qQVJ3rW4JKQ4I5gikOIwkqaUq8ZmuCplMk5SzMD4aD1EXmI4SF+FTZiGB8IIBDOCBXzhJQv1HUow7FTMWlKCqWnLr4S4dmALaMAfw0IYtC5ozqnKzkhBK0itsrE/T5PDuO4EZQdyRUkkhwHJuGJsP2isn8XWlSahaR0Cr1BUk1667loE45Irm0NjqW8S6lSJkpAFxdRJZhUgJ3Yfal4Hi55UopWWbw51DNlBukUYm4tXu8SlcalqAJXMRT9S6GtnAp3eLDEHMnMkJTU1DsAX1FfzHQz1UZL5k5p90Awk0KCHdMwkOVUUR4vDmSAOxGoppFJgpZJzOVmZpoDmIIW40v28jzMOHKUrObKMyU0W18xUemmqoe4PgSliHJLnMW/Ve3MHltelHljkS/b9gadF0WUr4Zk/LAlgBdXJLuekZri/DpkiaCWbK1wToxKS1KU2YRv0IZL2MLcZ4OJyWdnZ7PTrHU4LymLIlJ2z54qRLUCCACCTmAKVFhQXqHLF36QLB4cozZ1ZlF69KC1/qhjHyBLmKlgipYO1Q4OuzXiM2bSzn9VNzy5Wiyp0zNKc0tF7eh5NTdhvq9KDVjCSz4gFBtPUaHvDM+bfU9i1Xo4ce7QqVVe1oLJEpiGYp1NOzVpHsmdoavT1iRkChD9Qx+0Blhl0qx+3IwDg61AsC7M17a1ELLBTe1x0LtDqwNDz1rz9YHNl5nGwd79nB5w1C2Ckzbtt6NygyUEgkE8g92bTlCOYBQB6faLIJyjUPbatoHGwGhXL+a1D1G9LvWGcEqpAb0OvUQDEhy41o45GttoPg1B6szas1Hb8RWAkhbESk5jmDnU1H/yj2CTlnMb392joe/zYUQUcwymgpbwksHo9Kk9doiXQcpVexIH6Rv1Jp0goDpDGhYdjU3hOYtbjIz6FxrU06X6mJS2LR3DYoKQoDNS1Q9R1tX8xD5amcocGv0guB4Sxu2hj3IVgKJSoggLB11d3rq/TnB5MwBFAyevU3VaphWubGTLLBTx/TiWEEqdQJq1QG5WGxZzDa0olIKSUEKATlAzbOyjUEe6xXcNxKElaFA/7jK+qgLUcMGajl7aaxb8AwFFZkBRCsqbrAoeXXnS8Qtt6Wevh0uCkUf8ApUwOkMrIR9QY9T/EDmS1y3dJe4yuqvMab0eNYtQSrQrbWgUNAbEkH8QzLwxV4mB6166c31tAindNjTw4qrSZXAYwmgKmbRAP0uatVxttWBYxOU/Mlq8dAoAnxbu9L009Yv53AUKUokHMqtPCSb00PeKuUJsoETEKyAl1C7nKPEDrlDOIq1qjUzI8MsctWN8FlwD4olhKhOSsIbKFJSkpzGoqnf8APKLL/Wpc4tLUVAhwaOA5vXYCKUY6TM8COagQkpylw30OA6c3/lrUQGdwhBUVJBl/UUqlqDOkfqSqqQ7VLd4bQ9KSGh1Xmbmvz2Nlw+d8wlCxmQRZy6X1BNeVOcVWO+F5OYqSVDk76tvzFooJcvEoUFE/NSFMFZig3oGILFyNWDvWHpXxCEpKZktaVgu6mIIB1U7C4FafaF0Rf6kaY5Vd45fL+x6dwdpXhAKWOtH71GhilRiAtC5U0qStISEBix0J8I/tOt6vGhl8SUkKzpKUsTXPzsoswLOLEdjFHOxspUzwySpYTmASkk5XGXSlHqaU5xKUdOyW5XU6uT2XcCMIqWM7qIIq9aEv1FasNYf4VxNdQtSsgFVKplcMA5NRQBojM+IZLZSFpOqVBuRDtS33ieF4AlaQqqquATRzajtr94nGTWzR2pTW5pcJj3qoKBy5R4qF9SLA6V5x4OLMZiEgkgZt3qB2ZxFXMw1AFUD/AGdmPu0VstM35mRSwAVAksakeJkuGZyKbjzdSc1T5JPGkeYrhM4zFKUCpzQi3UVfXaF8XgVImBC733feoIMfQJE18pUHaxgXEcEia7gPoWBb0p2jrlCu5jyY1J+h8zmJbpz86vAEvztz/wARt8T8PS0oqbVub71JjJ4SUVCZkSfAS5Y6AbX/ADDrInzsQlikla3ISp1LilNNu14mlLAWqXHs1esQnAfs5ewH8VgUuYFAhVGcgVGosNLv5RWyLQdTaULaUtp3hRaiFK935j7w2g6hqFjS1QBUU02hTFJDg6m9X1gvgUnhD4qpB/yNDe0MrU4GjfzC8ijbFm8zB81m1H7wpxGYkMCBq59doJgAHuxYVroDS2rwP9JGo+zRPCJ5W5Hav09ftFYE5g5i0Al6lzXOn/6x5C+JxBCjc60IN637x0PQKEZU/L0q3f1FvWATFP8AWHBLGtqsCN7esTIL0D+nKvcx2IkK+gtZ7gUAe51rSM+7LR5DJl5brJceBwHILu6nrRzr6QUOHDXpSnK/37wugqFCGb1Z7PWJhfidi23KOYwcT1pyFw6Vn6SNno/QH3TY8D4g4LHKt6irGhFNjX+YznB8KJ0zISxFQbtqwD1BcvaNXh+EgCpL9B+L2iUnLV5Xwej0+nwqZXcbxKlFJCXUkucwcMTsaUdv+6H+H4hcuWlJAW+wr7oTCU3DEmiSyTYv1DMH+8Sn401GWzB9QD+4DV57QFO/1GnZrTRZ/wBZLJZlJUNSNbtzGvePJOFclS0hQHifejBnP39bQCR4zU0CQ3RodwWIAcMMv2iylv8AARxqOxR4ng4+YpWHUpANwxykm7hOlAacoBOxU2T8tM0BQJAKvqA1Ay6EvodDWNxhvlUNjvv22uD1ip+JOGJmIUmWDUvuHajHTvtBvStiEoxm6aK4lIIukFtFpYkkEjLRNhRy7Vs0HMjMlPzHIfwgplzPCSQadRc9nii4VjBmlP4E5WJ1SfCP1GoCmD2uBqYv0pORSAUlRZJWDnFXYqCWOlHANmZnjSkmrRiap0wWG4Zh0MTLSlwzOQxZx4F0SbmwPKHkSkpbKkDM30paqa1Ujn5nUO0V9UhvmzFEBgjMEl1Et9aWYBgzm4JesGM8FIzeBSQVeEeEMG+pJIqzFmu1YDj3FasU4xhTOyMUlYFPECggvmDG7jaxDGFuFcaOHIlThlSB4VF7H9L6jZXaGOIzfDmBYBRIAYZjQFQDA33DODFTOnEglSg4JQQospRAIBKSKWZ70S28RyRt2UxzcfYuMdxuTMSWAY1FGsbh6t6QHD47MAlSbAqoQrfblTked6uVwgKzVUMtPCzlhVmoLQpIKpfzMpzAJdgrK5LeIpJZwkKBbVolHHbuRtj1UZR08M22G40h/CRSjadibj7GDLxz1LVDjKXoekYaRjkZBlUpJd3qGc6iw/iIonzFIaWGDOAA9Q1RtRuUJaruXeM1mIxyvlkhQUaMLhlWJV+lnubNZqxZcCkAykkpCVEOoc9dBqTGV4XOmJUEGjtVXiINXDps7kihv1MazDYxMsBPR7a7NpCvS69SWSDSdFV8R8BdIMpganlz6RiASFeJ7gGlb7R9F4lxpIQohKlZb5a8u1aV1jET5brC6ALZdDUXp6d+8UXw4MGRVzyey1A3FdDycmrV0215QviJxUyQKUrS/wCRBVFLbtR25cufo0Jy5oCnKjZw1ai1/vpFuxnHLBLsNzpHKVS3tuUCUqtdjfkBHJW/Z9OkBHMLMNCLf45xOQDoHf8A41caBjUM325wJbV79NIJOWQg3Y0NrEuBoW1b8F4pBCSK1eJS9QH6EegMdCS11+mOhrYtFnhiKuGJIoHAqXL9wKaM8DSsKaWosnMSkkBnUzv4dgPKg3liZdyCw+2gvX/MJqmMfPrtUX3iblRRbhilRSAASwJdxVy2proKeULSyaczQbE9I9mYk5QSpXhBYF2HIdz5wPDkqrqS7FqAPoYSVDotOGYsypqVpLPS1SCWLMOXoY+k8OnhSQ5B1Fq/tSsfI0KdgCXewNdtbV93hjD4mZJDJUWoSkHvTYxNpp6kacWRVpZ9GmklyCwFKdaVNusIYtKASp3CSA9iXvUsAABaE8BxcTZdVJzMH3N21vT1MMqWPlk5SU0fMxHisSHNizU1hVJSN6VE8NPCU1IIKixs9BcevcQWXOqCp8rsefQgRHKVBgCtWpTmFDd1fpq1OfSKjGy5iVqFmUPCSoPahVRnIbekLO4u0GO5Z4/idVEAsFBI3G3hBcihvQU5O3gPEl1Glz0vXu/pGdM4kABdQKvVqjfW4cbed2nGpTIBSp166V2G9AIZvUvYCW1/IrsUV4ed/tFXySA6ACkgAuFApuUsDvRtXiw+ZJnIKc/jIdf0pWC4JozuS/NiRY+KuxHEpk8sSMx8WYE8qEBXp60hSSTLmAZlO9ttaPcAb1veLQzSjae5CWDVT4NHh8LKmZc4OZKMgQFOlYQMpCrZWCSa0GZJ1VCnEUpA/wDUVmFFKUEq+aB4szUYuCXbNoYssDjyQCQlQHnYhKknRSasesZydiig5AkFLlqgckgigoLquQDbXTHNCSIS6ecewWfMSUsnKPqrUkJWoAgqd2DWvUjoitNwDvrzNOt6fvSvlTDKzA56G9W1bxC5ck9+cM/NzpdKVFKbljRnJFq/U5FdDGeUlJiOEl2CS1gAkkChp5JHLW9PMQUzZZFQlZc1oWAYC4ejnrTnFUZc5Rf5ZWlKnKXCSz7UIDxYYnATKKlyhkVt1OopYgWFjrC3UbD4Mm6PZeDkrJeZ8uimASpVRZ6+EE89oQkTDJX4swBzZSmgIUCxTtX9UMSeFz1A0bRh4jd/pFg/7xYf6DMCCsoKUoBCjza/TR7h7UjtUWPjWTGweHxZ0YhqVoP7SEvTwtU6mr0AJJ4qUTCFOBUhw4UCAA5LPTa4O8Vc+QhKSoFWYVAYr/UwBKi4pUXf7Bw3FJqEhKmWh8wzJBrbaw2HPUwsoyUrLx6jG46XsXGM4r8wpZJCCSkgHJmIBU5BBBYV3rCiVgJYE0e77C0BVxWUoGmVTfSSQkkWaoBZrdaVhuXKJSkkXSSzsQMwSTXp+8GLtIzdSkpJoUxEupqWD16AbU3hGatyT1/GkMYtbWua2Ys+4pCT19vfR4ozIPyFeHxKFXbcVaoFokARarE19iK4Gvn6mH0znFHbmzmtyzV533gIDJ5wrzLvTWIcUnUZ36kc6W5/fk3sqqnGlf1f5iv4nNLgnal7W2ii4FfIjMm1joEox0C2Gi8nzd6sw5Ur9zCq0sqhBAN2+28P4uSXoTW5tep7QoklLsBUFJBALZutqVBuKEQJL1CmAM0MkFKVAE6DMD4TfWoZjQVs8TkJKiEJSeSb87i1B6QVPDipHzAUhOYp50A07ip1faOmyFIcINC5J/XSz7eKjdYFNO2NaGsZOJIUwTMqTlYfUonwhIZICTod7QD5hNLvvpzGlnNtIH/V5gcwKSGagP0hmqev7R6JiQxCnZrAiwJNDapZzAb3sKQHG4YgZkpLPQgFta6UMXXAOMqUTLWUpOmcUZxRhera0hf/AFMkgzAFpcZmqVEl7bk1o0AxipU36UsSLBrvTVnHkxFYVwXMWaMWeUNmtjajELzMQlIBSoKCdQSNKGmUkgC5pqB4xEnNMUCczChsG0AbYDuVPyzHB+NLlOme0yW1FB321t1GwjScNShSAUEKSo3NGffSB4ra0tb/AJwa4KD817fnIrJQ2YLcABkqawcsABpV/OEsbhiC8tRUHHhHYE1IbrXs0amZgwpBJLpeoDUfUtTl5RV4/DK/9MM9mDWvy0PrCSTpd/5Kalbrb+CpwayggqDtYFtNNjbvA8RNmTF5wEgPc0O50tblSNHw3hZKFgh1Dy6fiKrEYNSVKBUyW8JJSSSS2UJd6Pen2dYqfLGlOLWlCOCxhupeUJcGuxGgvUdIdxyxkQkFvExKiHdia5SWqGoXqH2iS8FnI/202y0ZI5u7ufbQzNwiQlKPlpSE7CgNfUgDmWhobL1YJztqzLoxNUJWwDsoWOoJpa3eL7ClASvJ4QQwygsoGgzAktrTmOsFTwiWsoXcHQhxckUN/qPt4tRhySGSkF7g17gdvKHTcbVCynqadiWDk5Q4BYiwHiuK9gX6PBlTgR4S2tebMzAg6ufWLLDyTlGcf7gIAcg7fkC8KBBSSGGY6nc771Fa67QyyeWlaEdarYL5zknNlagFdXzMHbu9YCrixRmSVZkKBCkFq7M9iS0HRhxMJTctQnoHcu9PtGM4thJkqYtCj9ILVcFJFGPn0Y95Ryec7NJKPBPG4z5q3qzvcG7sKAUalf3cXEFACW6zY+EOWIa40J3ZvDHINzqCaUsBU7fiBfLoasQxqDV9BtfXbekWu7fqed3PE4Ys6XelCBq9IKOInwpKQCnKzet6F/KsBmlaaqPJtLae9YZKwpP0j0IDJ0Jr7Ecl2FZELzq+pwGIcG9XtEikHLvQ+tfR4EqckVYPyvaJyZoKS5q4ozhm30LtDIRg8Sg0OWjB2Dak9z+0eSA4uGptzMRnTnoLUvu0ElLFNgRSm2/7wXyAPOOSXTUXYtrsdm0ignLqRDvEJ+jWDWA2Gh93uYrFqgv0OSJD3ePIiCPYj2FONZIUCDUsH8QBqbApNObW/EKTsMkB0OGqwew611eKzAYvKRWnlzuPzF84UAeg33NW8vxFNmheAnCFLTJUAlk/MGYqyqCigBQSlKhQi5a+YAhoEAKpYAEB+epP/uZzvHkmji2YHKksWzqGYpB+ksgVGwjlmrg1D1NKmgvyD94MuEFA/wChBuCXO5uoGnpc+ULzZIDsah3DMA5p3I0bSHpamLvvXfKGuL6/vEvlJUBmppQimQEjlc1azmJuN8DJlUqTWopXQ8hRubWN2rWPUy8pAzKzppbKQEvcdq11IaJ4jDZQ+cBgP7s1QaCtaHb8x78lLkGY8wuojKoh6E1IuMyd6qG8JVIomMyUBSSkgKUQGKqAdVafpqaNCvDOILknOio1SSQHLmhqx5de8DNIKiKO9tCzV23hnMPmArmuVBRWpQUFZiWZTOVO6TVxUwXFTS9UPCTjuh3CfEgUspmgyydi4PXnYxpxhysJKVoUBtcg8uVoosTgUYxJlvlmpRmQXACjUqQlCQSHfMHNSVamKjCYrFygBKcukMcqicpOUVFGelQIlLFKL2Zph1Cktz6BJkzEpLAF4osRjsOlSjNUlxR3o4zM5sD4lRVLlcVmlQUZicpyqeWQUlgbNmsdPKE08ESCozVfS+YBJCU2bM9Ekqo51cm1eUMjewXnh3LzH8ZUoZJCEKDVW6w2yRlSXJLB9CRHh+I0JUZc4FNcpfMASCzgt4heohBONmSwlCVACSfloqAykqzOkIZQc/q/5VIegcYVT1CbPdXzPEohIyqIIDCgAL5QaN1eKS6aLjd7/QmuoafGxoMbx3DFCCiayks4SpywNX5sdecWOB42hYBz1GtnAr0FYwsvhEkpAUySQ6WUzZiALn/MKTOEFGUpUqr/AEl7FhrW2kSePJHdMf8AyINU0fSMXxJIFKm7Oz93gCOMYdIzTCH2JBa/vvHzpQVb5kwA6O5pyOmj0gXyspq5LkVD6btv+LRPRJvk7xo0a/i3xTKd5WY8k2ppcNrGdx3EFTlFawRQAdAf5+0KoyglxS2xoO/vrBZM2Wli5VahGw8qQ0MSRPJnclXYkhDVcWJ21am/do8nKUSoPTctr21/MTRMzeFIy7l2oWLNp6xKbhsqBMSoheZIykZj4nOcHT6Wa7gxoivQzkVYhGUAh2JoKbDp/kxyTmScxYO5AAJrqE+eouISluGvXTqYcQinaltTr70gJtisiUPUUoTW1Nt/Yg4AD9DsdBV/zEJqyzhhc61qKe94GxJNTz0ufYh0khLJSJJO7P5sI6dOyhhc3r+473g0whALsW2NNGfLY/ZjqIpsViSouSeVer6dINUcCnLer/beAKUHpHpVAlmAEnmjoFmjo44ZlGL7hE4kGuh2H6VbR5HQ0QS4HpMsKmMqwtcWSNo8Smg5Eeor9zHR0ECJqFBzFf8AyjzMSS9aKPpHR0ccGP1Ecj9kj7ExWzfBPZFAUuRuXTv1Mex0B8opEHJL1NSDTs8PycGgpmEpFJWYXFX2HU0jo6ESQzHcKnxlqa0oQSkOxuO0D+IZYKpYLsuQmYoOWK1SlrJP/cAezWjo6K8R+YEXfxHilokYRCFqSlUrIpjUhBdNbuChNb0aMm+YKKql7nr/ACfOOjoOZvV8v+hRKUkKkTSQCXll2D3WL6BtLUGwhTBzCmapmsRYGjc+gjo6Elto9vuwruO4OSlUuaSKponRnCntvHuAWTLU/wD+MHuJrfYCOjoMOfkwCeMLrzakAnrSvWkOTpYOGmzDVaVywkuaZvmPyrkR5R0dCf7SOKkJp/5RKYGHdfoKR0dEgsZlJyrOWn+IWxkwln0AIoLkF/sPKOjoaPArFnt2+wixwlh2/MdHQY8ivgKRSWNwHqdSt/sIiTbq3rHR0UFK/FF1qff94RUpgRoWJoNAddLn2I6Ogdwi5iCo6OgHAzHR0dAOP//Z', [
  //     new Ingredient('bacon', 1),
  //     new Ingredient('lard', 1),
  //     new Ingredient('lard', 1)
  //   ])
  //];

  private recipes: Recipe[] = [];

  constructor(private shoppinglistService: ShoppingListService) { }

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes[index];
    this.recipesChanged.next(this.recipes.slice());
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppinglistService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1)
    this.recipesChanged.next(this.recipes.slice());
  }

}
