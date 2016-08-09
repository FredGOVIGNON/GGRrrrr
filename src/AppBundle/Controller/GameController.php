<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\Common\Collections\ArrayCollection;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;

use AppBundle\Entity\Score;

use AppBundle\Entity\Challenge;

class GameController extends Controller
{
    /**
     * @Route("/challenge/{id}", requirements={"id" = "\d+"}, defaults={"id" = 1}, name="game")
     */
    public function gameAction(Challenge $Challenge)
    {
        $challengeId = $Challenge->getId();

        return $this->render('default/game.html.twig', array('id'=>$challengeId));
    }

    /**
     * @Route("/challengelist", name="challengelist")
     */
    public function challengeListAction()
    {
        $em = $this->getDoctrine()->getManager();
        $challenges = $em->getRepository('AppBundle:Challenge')->findAll();

        $votes = $em->getRepository('AppBundle:Vote')->findAll();
        return $this->render('default/challengelist.html.twig', array(
            'challenges' => $challenges,
            'votes' => $votes
        ));
    }

    /**
     * @Route("/score/new", options = { "expose" = true }, name="scoreNew")
     */
    public function scoreNewAction(Request $request)
    {
        if($request->isXmlHttpRequest())
        {
            $em = $this->getDoctrine()->getManager();
            $user = $this->getUser();
            $totalScore = $request->request->get('score');
            $idChallenge = $request->request->get('id');
            $scores = $em->getRepository('AppBundle:Score')->findOneBy(array('idChallenge' => $idChallenge, 'idUser'=> $user));

            $response ='empty';
            
            if (!empty($user)){
                $response ='full';
                if (!empty($scores)) {
                    $oldScore=$scores->getScore();
                    if ($oldScore<$totalScore){
                        $scores->setScore($totalScore);

                        $em->persist($scores);
                        $em->flush();
                    }
                }
                else {

                    $score = new Score();
                    $challenge = $em->getRepository('AppBundle:Challenge')->findOneById($idChallenge);

                    $score->setScore($totalScore);
                    $score->setIdChallenge($challenge);
                    $score->setIdUser($user);

                    $em->persist($score);
                    $em->flush();
                }
            }

            return new Response(
                $response
            );
        }
    }

    /**
     * @Route("/score", options = { "expose" = true }, name="scoreList")
     */
    public function scoreListAction()
    {
        $em = $this->getDoctrine()->getManager();

        $challenges = $em->getRepository('AppBundle:Challenge')->findAll();

        return $this->render('default/scoreList.html.twig', array('challenges'=>$challenges));
    }

    /**
     * @Route("/score/challenge/{challenge_id}", options = { "expose" = true }, name="score")
     * @ParamConverter("score", class="AppBundle:Score", options={"repository_method" = "findByIdChallenge", "mapping": {"challenge_id": "idChallenge"}, "map_method_signature" = true})
     */
    public function scoreAction($score)
    {

        return $this->render('default/score.html.twig', array('scores'=>$score));

    }
}